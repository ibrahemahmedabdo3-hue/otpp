import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('otp')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Post('send')
  send(@CurrentUser() user: any, @Body() dto: SendOtpDto) {
    return this.otpService.send(user.id, dto);
  }

  @Post('verify')
  verify(@CurrentUser() user: any, @Body() dto: VerifyOtpDto) {
    return this.otpService.verify(user.id, dto);
  }

  @Get('history')
  history(@CurrentUser() user: any, @Query('limit') limit?: string) {
    return this.otpService.history(user.id, limit ? parseInt(limit, 10) : undefined);
  }
}
