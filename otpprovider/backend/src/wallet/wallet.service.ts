import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RechargeDto } from './dto/recharge.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async recharge(userId: string, dto: RechargeDto) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    // NOTE: In production this should only credit the wallet after a payment
    // gateway webhook confirms the charge succeeded (Stripe/PayPal/etc).
    // The `method: manual` path is for admin-approved manual transfers.
    const [updatedWallet] = await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { userId },
        data: { balance: { increment: dto.amount } },
      }),
      this.prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: dto.amount,
          type: 'CREDIT',
          reason: `Recharge via ${dto.method}`,
        },
      }),
    ]);

    return updatedWallet;
  }

  async transactions(userId: string, limit = 50) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    return this.prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
