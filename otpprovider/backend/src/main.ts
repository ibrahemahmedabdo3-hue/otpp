import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { SubdomainMiddleware } from './microsites/subdomain.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // In production, restrict to the deployed frontend origin; falls back
    // to allow-all in local dev so `docker compose up` works out of the box.
    cors: buildCorsOptions(),


  });

  app.use(helmet());

  // See microsites.module.ts for why this is a plain app.use() instead of
  // a NestModule forRoutes('*') wildcard.
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

  const config = new DocumentBuilder()
    .setTitle('OTPProvider Cloud API')
    .setDescription('Enterprise OTP delivery & verification platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`OTPProvider Cloud API running on port ${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();

