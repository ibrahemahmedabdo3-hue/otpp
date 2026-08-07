import { Module } from '@nestjs/common';
import { MicroSitesService } from './microsites.service';
import { MicroSitesController } from './microsites.controller';
import { SubdomainMiddleware } from './subdomain.middleware';

// NOTE: SubdomainMiddleware is intentionally NOT wired up here via the
// standard NestModule.configure()/forRoutes('*') pattern. A bare '*' (and
// even a RegExp) route is compiled through path-to-regexp under the hood,
// and the version pulled in transitively by Express throws "Missing
// parameter name" for exactly this "match everything" case — crashing
// every single request. Instead it's attached directly with a plain
// app.use() in api/index.ts / src/main.ts, which runs on every request
// without going through path-to-regexp at all.
@Module({
  providers: [MicroSitesService, SubdomainMiddleware],
  controllers: [MicroSitesController],
  exports: [MicroSitesService, SubdomainMiddleware],
})
export class MicroSitesModule {}
