import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { RechargeDto } from './dto/recharge.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  getWallet(@CurrentUser() user: any) {
    return this.walletService.getWallet(user.id);
  }

  @Post('recharge')
  recharge(@CurrentUser() user: any, @Body() dto: RechargeDto) {
    return this.walletService.recharge(user.id, dto);
  }

  @Get('transactions')
  transactions(@CurrentUser() user: any, @Query('limit') limit?: string) {
    return this.walletService.transactions(user.id, limit ? parseInt(limit, 10) : undefined);
  }
}
