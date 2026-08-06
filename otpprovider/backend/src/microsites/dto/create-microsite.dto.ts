import { IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { SiteStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMicroSiteDto {
  @ApiProperty({ description: 'Subdomain label only, e.g. "promo" for promo.otpprovider.com' })
  @IsString()
  @MaxLength(63)
  @Matches(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, {
    message: 'Subdomain must be lowercase letters, numbers, and hyphens only',
  })
  subdomain: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  metaDescription?: string;

  @ApiProperty({ enum: SiteStatus, required: false })
  @IsOptional()
  @IsEnum(SiteStatus)
  status?: SiteStatus;

  @ApiProperty({ description: 'Full HTML body content for the page' })
  @IsString()
  htmlContent: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customCss?: string;

  @ApiProperty({ required: false, description: 'Custom JS injected at the end of <body>' })
  @IsOptional()
  @IsString()
  customJs?: string;
}
