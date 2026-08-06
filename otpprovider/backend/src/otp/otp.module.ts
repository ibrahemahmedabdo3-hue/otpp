import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { SmsProvider } from './providers/sms.provider';

@Module({
  providers: [OtpService, SmsProvider],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}
