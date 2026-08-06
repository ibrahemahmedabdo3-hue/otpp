import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMicroSiteDto } from './dto/create-microsite.dto';
import { UpdateMicroSiteDto } from './dto/update-microsite.dto';

@Injectable()
export class MicroSitesService {
  constructor(private prisma: PrismaService) {}

  async create(actorId: string, dto: CreateMicroSiteDto) {
    const existing = await this.prisma.microSite.findUnique({ where: { subdomain: dto.subdomain } });
    if (existing) {
      throw new ConflictException(`Subdomain "${dto.subdomain}" is already in use`);
    }

    const site = await this.prisma.microSite.create({
      data: { ...dto, createdById: actorId },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: actorId,
        action: 'MICROSITE_CREATED',
        metadata: { subdomain: site.subdomain, status: site.status },
      },
    });

    return site;
  }

  findAll() {
    return this.prisma.microSite.findMany({
      orderBy: { createdAt: 'desc' },
      include: { createdBy: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
  }

  async findOne(id: string) {
    const site = await this.prisma.microSite.findUnique({ where: { id } });
    if (!site) throw new NotFoundException('Sub-domain page not found');
    return site;
  }

  async update(actorId: string, id: string, dto: UpdateMicroSiteDto) {
    await this.findOne(id);
    const site = await this.prisma.microSite.update({ where: { id }, data: dto });

    await this.prisma.auditLog.create({
      data: { userId: actorId, action: 'MICROSITE_UPDATED', metadata: { id, ...dto } },
    });

    return site;
  }

  async remove(actorId: string, id: string) {
    await this.findOne(id);
    await this.prisma.microSite.delete({ where: { id } });

    await this.prisma.auditLog.create({
      data: { userId: actorId, action: 'MICROSITE_DELETED', metadata: { id } },
    });

    return { success: true };
  }

  /** Public lookup: only ever returns a PUBLISHED site, used by the unauthenticated renderer. */
  async findPublishedBySubdomain(subdomain: string) {
    const site = await this.prisma.microSite.findUnique({ where: { subdomain } });
    if (!site || site.status !== 'PUBLISHED') {
      return null;
    }
    return site;
  }
}
