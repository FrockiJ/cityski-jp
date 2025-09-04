import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformResponseInterceptor } from './common/interceptors/transform-response';

import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // load environment variables from .env file
  // dotenv.config();
  const app = await NestFactory.create(AppModule);

  // global format success response
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  // app.useGlobalPipes(new ValidationPipe());
  // global format error response
  app.useGlobalFilters(new HttpExceptionFilter());

  // sets the global base route to prefix all apis routes
  app.setGlobalPrefix('/api');

  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors({
    origin: [
      // process.env.CLIENT_DOMAIN,
      // process.env.CLIENT_ADMIN_DOMAIN,
      // process.env.NEXT_PUBLIC_BACKEND_URL,
      configService.get<string>('CLIENT_DOMAIN'),
      configService.get<string>('CLIENT_ADMIN_DOMAIN'),
      configService.get<string>('NEXT_PUBLIC_BACKEND_URL'),
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Enable sending cookies and other credentials
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false, // Set to true in production
    }),
  );

  await app.listen(process.env.PORT);

  // kill process if interrupted
  process.on('SIGTERM', () => {
    app.close().then(() => {
      console.log('NestJS application terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    app.close().then(() => {
      console.log('NestJS application interrupted');
      process.exit(0);
    });
  });
}
bootstrap();
