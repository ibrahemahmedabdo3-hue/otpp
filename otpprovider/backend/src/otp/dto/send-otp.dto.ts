import { IsEnum, IsString } from 'class-validator';
import { OtpChannel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ enum: OtpChannel })
  @IsEnum(OtpChannel)
  channel: OtpChannel;

  @ApiProperty({ description: 'Phone number, email, or chat ID depending on channel' })
  @IsString()
  destination: string;
}
