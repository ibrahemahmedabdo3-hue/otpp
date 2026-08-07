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
    //
    // NOTE: a bare '*' string route is intentionally NOT used here — newer
    // path-to-regexp versions (pulled in transitively by Express) reject it
    // with "Missing parameter name", crashing every single request. A plain
    // RegExp bypasses path-to-regexp compilation entirely and matches
    // everything, so it's the safe way to express "all routes" here.
    consumer.apply(SubdomainMiddleware).forRoutes(/.*/);
  }
}
