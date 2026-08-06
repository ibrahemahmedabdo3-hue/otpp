import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.RESELLER)
  @Post()
  create(@CurrentUser() actor: any, @Body() dto: CreateUserDto) {
    return this.usersService.create(actor, dto);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT, Role.RESELLER)
  @Get()
  findAll(@CurrentUser() actor: any) {
    return this.usersService.findAll(actor);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT, Role.RESELLER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.RESELLER)
  @Patch(':id')
  update(@CurrentUser() actor: any, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(actor, id, dto);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.RESELLER)
  @Post(':id/suspend')
  suspend(@CurrentUser() actor: any, @Param('id') id: string) {
    return this.usersService.suspend(actor, id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.RESELLER)
  @Post(':id/activate')
  activate(@CurrentUser() actor: any, @Param('id') id: string) {
    return this.usersService.activate(actor, id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@CurrentUser() actor: any, @Param('id') id: string) {
    return this.usersService.remove(actor, id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPPORT, Role.RESELLER)
  @Post(':id/reset-password')
  resetPassword(
    @CurrentUser() actor: any,
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.usersService.resetPassword(actor, id, newPassword);
  }
}
