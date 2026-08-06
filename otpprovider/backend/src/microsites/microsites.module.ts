import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MicroSitesService } from './microsites.service';
import { MicroSitesController } from './microsites.controller';
import { SubdomainMiddleware } from './subdomain.middleware';

@Module({
  providers: [MicroSitesService],
  controllers: [MicroSitesController],
  exports: [MicroSitesService],
})
export class MicroSitesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Runs on every incoming request, before routing, so it can intercept
    // sub-domain hosts regardless of the requested path.
    consumer.apply(SubdomainMiddleware).forRoutes('*');
  }
}
