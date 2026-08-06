import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// SECURITY: role is intentionally NOT accepted here. Public self-registration
// always creates a CLIENT account (enforced in AuthService.register). Every
// other role (Admin, Support, Reseller, Super Admin) can only be created by
// an authenticated, permission-checked user via POST /users — never through
// this public endpoint.
export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;
}
