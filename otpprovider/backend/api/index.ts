// Vercel serverless entry point.
//
// This wraps the exact same NestJS app used in src/main.ts (same modules,
// same guards/filters/prefix) inside an Express instance and adapts it to
// Vercel's Node.js function runtime via serverless-http. The app is built
// once per warm function instance and reused across invocations (cold start
// only pays the bootstrap cost once).
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import helmet from 'helmet';
import serverlessHttp from 'serverless-http';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { SubdomainMiddleware } from '../src/microsites/subdomain.middleware';

let cachedHandler: ReturnType<typeof serverlessHttp> | null = null;

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    cors: process.env.FRONTEND_URL && process.env.NODE_ENV === 'production'
      ? { origin: process.env.FRONTEND_URL, credentials: true }
      : true,
  });

  app.use(helmet());

  // Runs on every request regardless of path, via a plain Express
  // middleware (no route-pattern compilation), so it can never hit the
  // path-to-regexp "wildcard route" crash. See microsites.module.ts.
  const subdomainMiddleware = app.get(SubdomainMiddleware);
  app.use((req: any, res: any, next: any) => subdomainMiddleware.use(req, res, next));

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.init();
  return serverlessHttp(expressApp);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  return (cachedHandler as any)(req, res);
}
