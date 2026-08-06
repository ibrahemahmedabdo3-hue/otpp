import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const roleHierarchy: Record<Role, Role[]> = {
  SUPER_ADMIN: ['ADMIN', 'SUPPORT', 'CLIENT', 'RESELLER'],
  ADMIN: ['SUPPORT', 'CLIENT', 'RESELLER'],
  RESELLER: ['CLIENT'],
  SUPPORT: [],
  CLIENT: [],
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(actor: { id: string; role: Role }, dto: CreateUserDto) {
    if (!roleHierarchy[actor.role]?.includes(dto.role)) {
      throw new ForbiddenException(`Your role cannot create a user with role ${dto.role}`);
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const resellerId = actor.role === 'RESELLER' ? actor.id : dto.resellerId;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        companyName: dto.companyName,
        resellerId: dto.role === 'CLIENT' ? resellerId : undefined,
        wallet: { create: { balance: 0 } },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: actor.id,
        action: 'USER_CREATED',
        metadata: { createdUserId: user.id, email: user.email, role: user.role },
      },
    });

    return this.sanitize(user);
  }

  async findAll(actor: { id: string; role: Role }) {
    if (actor.role === 'RESELLER') {
      const users = await this.prisma.user.findMany({ where: { resellerId: actor.id } });
      return users.map(this.sanitize);
    }
    const users = await this.prisma.user.findMany();
    return users.map(this.sanitize);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { wallet: true } });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  async update(actor: { id: string; role: Role }, id: string, dto: UpdateUserDto) {
    await this.assertManageable(actor, id);
    const user = await this.prisma.user.update({ where: { id }, data: dto });

    await this.prisma.auditLog.create({
      data: { userId: actor.id, action: 'USER_UPDATED', metadata: { targetUserId: id, ...dto } },
    });

    return this.sanitize(user);
  }

  async suspend(actor: { id: string; role: Role }, id: string) {
    await this.assertManageable(actor, id);
    const user = await this.prisma.user.update({ where: { id }, data: { status: 'SUSPENDED' } });
    await this.prisma.refreshToken.updateMany({ where: { userId: id }, data: { revoked: true } });
    await this.prisma.auditLog.create({
      data: { userId: actor.id, action: 'USER_SUSPENDED', metadata: { targetUserId: id } },
    });
    return this.sanitize(user);
  }

  async activate(actor: { id: string; role: Role }, id: string) {
    await this.assertManageable(actor, id);
    const user = await this.prisma.user.update({ where: { id }, data: { status: 'ACTIVE' } });
    await this.prisma.auditLog.create({
      data: { userId: actor.id, action: 'USER_ACTIVATED', metadata: { targetUserId: id } },
    });
    return this.sanitize(user);
  }

  async remove(actor: { id: string; role: Role }, id: string) {
    if (actor.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only Super Admin can delete users');
    }
    await this.prisma.user.delete({ where: { id } });
    await this.prisma.auditLog.create({
      data: { userId: actor.id, action: 'USER_DELETED', metadata: { targetUserId: id } },
    });
    return { success: true };
  }

  async resetPassword(actor: { id: string; role: Role }, id: string, newPassword: string) {
    await this.assertManageable(actor, id);
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
    await this.prisma.refreshToken.updateMany({ where: { userId: id }, data: { revoked: true } });
    await this.prisma.auditLog.create({
      data: { userId: actor.id, action: 'PASSWORD_RESET', metadata: { targetUserId: id } },
    });
    return { success: true };
  }

  private async assertManageable(actor: { id: string; role: Role }, targetId: string) {
    const target = await this.prisma.user.findUnique({ where: { id: targetId } });
    if (!target) throw new NotFoundException('User not found');

    if (actor.role === 'SUPPORT' && target.role !== 'CLIENT') {
      throw new ForbiddenException('Support can only manage client accounts, and cannot delete them');
    }
    if (actor.role === 'RESELLER' && target.resellerId !== actor.id) {
      throw new ForbiddenException('You can only manage your own clients');
    }
    if (actor.role === 'CLIENT') {
      throw new ForbiddenException('Insufficient permissions');
    }
    return target;
  }

  private sanitize(user: any) {
    const { passwordHash, twoFactorSecret, ...rest } = user;
    return rest;
  }
}
