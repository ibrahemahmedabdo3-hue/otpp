import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  private async issueTokens(userId: string, email: string, role: string) {
    const accessToken = this.jwt.sign(
      { sub: userId, email, role },
      {
        secret: this.config.get('JWT_ACCESS_SECRET') || 'dev-access-secret',
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES') || '15m',
      },
    );

    const refreshToken = uuidv4() + '.' + uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt },
    });

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'CLIENT', // public self-registration is always CLIENT; see RegisterDto
        wallet: { create: { balance: 0 } },
      },
    });

    await this.prisma.auditLog.create({
      data: { userId: user.id, action: 'USER_REGISTERED', metadata: { email: user.email } },
    });

    return { id: user.id, email: user.email, role: user.role };
  }

  async seedDemoAccounts(key: string) {
    if (key !== 'otp-seed-2026') {
      throw new UnauthorizedException('Invalid seed key');
    }

    const accounts: { email: string; role: any; firstName: string; lastName: string; password: string }[] = [
      { email: 'superadmin@otpprovider.com', role: 'SUPER_ADMIN', firstName: 'Super', lastName: 'Admin', password: 'ChangeMe123!' },
      { email: 'admin@otpprovider.com', role: 'ADMIN', firstName: 'System', lastName: 'Admin', password: 'ChangeMe123!' },
      { email: 'support@otpprovider.com', role: 'SUPPORT', firstName: 'Support', lastName: 'Agent', password: 'ChangeMe123!' },
      { email: 'reseller@otpprovider.com', role: 'RESELLER', firstName: 'Reseller', lastName: 'Partner', password: 'ChangeMe123!' },
      { email: 'client@otpprovider.com', role: 'CLIENT', firstName: 'Demo', lastName: 'Client', password: 'ChangeMe123!' },
    ];

    const results: { email: string; role: string }[] = [];
    for (const acc of accounts) {
      const passwordHash = await bcrypt.hash(acc.password, 12);
      const user = await this.prisma.user.upsert({
        where: { email: acc.email },
        update: {},
        create: {
          email: acc.email,
          passwordHash,
          firstName: acc.firstName,
          lastName: acc.lastName,
          role: acc.role,
          status: 'ACTIVE',
          wallet: { create: { balance: 100 } },
        },
      });
      results.push({ email: user.email, role: user.role });
    }

    return { message: 'Demo accounts ready', accounts: results };
  }

  async login(dto: LoginDto, ip: string, userAgent: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      await this.logLoginAttempt(null, dto.email, false, ip, userAgent);
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      await this.logLoginAttempt(user.id, dto.email, false, ip, userAgent);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      await this.logLoginAttempt(user.id, dto.email, false, ip, userAgent);
      throw new UnauthorizedException('Account is not active');
    }

    if (user.twoFactorEnabled) {
      if (!dto.twoFactorCode) {
        throw new UnauthorizedException('2FA_REQUIRED');
      }
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token: dto.twoFactorCode,
        window: 1,
      });
      if (!verified) {
        await this.logLoginAttempt(user.id, dto.email, false, ip, userAgent);
        throw new UnauthorizedException('Invalid 2FA code');
      }
    }

    await this.logLoginAttempt(user.id, dto.email, true, ip, userAgent);
    await this.prisma.auditLog.create({
      data: { userId: user.id, action: 'LOGIN_SUCCESS', ip },
    });

    const tokens = await this.issueTokens(user.id, user.email, user.role);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  private async logLoginAttempt(
    userId: string | null,
    email: string,
    success: boolean,
    ip: string,
    userAgent: string,
  ) {
    await this.prisma.loginHistory.create({
      data: { userId: userId ?? undefined, email, success, ip, userAgent },
    });
  }

  async refresh(token: string) {
    const record = await this.prisma.refreshToken.findUnique({ where: { token } });
    if (!record || record.revoked || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: record.userId } });
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account not available');
    }

    // rotate: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revoked: true },
    });

    return this.issueTokens(user.id, user.email, user.role);
  }

  async logout(token: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true },
    });
    return { success: true };
  }

  async setupTwoFactor(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const secret = speakeasy.generateSecret({
      name: `OTPProvider Cloud (${user.email})`,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });

    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url!);
    return { secret: secret.base32, qrCode: qrCodeDataUrl };
  }

  async enableTwoFactor(userId: string, code: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.twoFactorSecret) {
      throw new BadRequestException('2FA setup not initiated');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!verified) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    return { success: true };
  }

  async disableTwoFactor(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });
    return { success: true };
  }
}
