import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { MicroSitesService } from './microsites.service';
import { CreateMicroSiteDto } from './dto/create-microsite.dto';
import { UpdateMicroSiteDto } from './dto/update-microsite.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('admin-microsites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@Controller('admin/microsites')
export class MicroSitesController {
  constructor(private microSitesService: MicroSitesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateMicroSiteDto) {
    return this.microSitesService.create(user.id, dto);
  }

  @Get()
  findAll() {
    return this.microSitesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.microSitesService.findOne(id);
  }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateMicroSiteDto) {
    return this.microSitesService.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.microSitesService.remove(user.id, id);
  }
}
