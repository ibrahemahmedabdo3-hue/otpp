import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { OtpChannel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SmsProvider } from './providers/sms.provider';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

const OTP_TTL_SECONDS = 300; // 5 minutes
const MAX_ATTEMPTS = 5;
const COST_PER_OTP: Record<OtpChannel, number> = {
  SMS: 0.05,
  WHATSAPP: 0.04,
  EMAIL: 0.01,
  VOICE: 0.08,
  TELEGRAM: 0.01,
  PUSH: 0.005,
};
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5; // per destination per minute

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private smsProvider: SmsProvider,
  ) {}

  private generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async send(userId: string, dto: SendOtpDto) {
    // Rate limiting per destination
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
    const recentCount = await this.prisma.otpRequest.count({
      where: { destination: dto.destination, createdAt: { gte: windowStart } },
    });
    if (recentCount >= RATE_LIMIT_MAX_REQUESTS) {
      throw new HttpException(
        'Too many OTP requests for this destination. Please try again shortly.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Billing: check wallet balance
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    const cost = COST_PER_OTP[dto.channel];
    if (!wallet || Number(wallet.balance) < cost) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    if (dto.channel !== 'SMS') {
      throw new BadRequestException(
        `Channel ${dto.channel} is not yet enabled on this deployment. SMS is fully live; other channels are being rolled out.`,
      );
    }

    const code = this.generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

    const otpRequest = await this.prisma.otpRequest.create({
      data: {
        userId,
        channel: dto.channel,
        destination: dto.destination,
        codeHash,
        expiresAt,
        maxAttempts: MAX_ATTEMPTS,
      },
    });

    const result = await this.smsProvider.send(dto.destination, code);

    if (!result.success) {
      await this.prisma.otpRequest.update({
        where: { id: otpRequest.id },
        data: { status: 'FAILED' },
      });
      throw new BadRequestException(`Failed to deliver OTP: ${result.error}`);
    }

    // Debit wallet
    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId },
        data: { balance: { decrement: cost } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: cost,
          type: 'DEBIT',
          reason: `OTP sent via ${dto.channel} to ${dto.destination}`,
        },
      }),
    ]);

    return {
      requestId: otpRequest.id,
      channel: otpRequest.channel,
      destination: otpRequest.destination,
      expiresAt: otpRequest.expiresAt,
      status: otpRequest.status,
    };
  }

  async verify(userId: string, dto: VerifyOtpDto) {
    const otpRequest = await this.prisma.otpRequest.findUnique({ where: { id: dto.requestId } });

    if (!otpRequest || otpRequest.userId !== userId) {
      throw new NotFoundException('OTP request not found');
    }

    if (otpRequest.status === 'VERIFIED') {
      throw new BadRequestException('OTP already verified');
    }

    if (otpRequest.expiresAt < new Date()) {
      await this.prisma.otpRequest.update({
        where: { id: otpRequest.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('OTP has expired');
    }

    if (otpRequest.attempts >= otpRequest.maxAttempts) {
      throw new BadRequestException('Maximum verification attempts exceeded');
    }

    const isValid = await bcrypt.compare(dto.code, otpRequest.codeHash);

    if (!isValid) {
      await this.prisma.otpRequest.update({
        where: { id: otpRequest.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid OTP code');
    }

    await this.prisma.otpRequest.update({
      where: { id: otpRequest.id },
      data: { status: 'VERIFIED', verifiedAt: new Date() },
    });

    return { verified: true, requestId: otpRequest.id };
  }

  async history(userId: string, limit = 50) {
    return this.prisma.otpRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        channel: true,
        destination: true,
        status: true,
        attempts: true,
        expiresAt: true,
        verifiedAt: true,
        createdAt: true,
      },
    });
  }
}
