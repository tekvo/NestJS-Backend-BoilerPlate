import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { initializeLogger } from './utils/logger';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { initializeSwagger } from './utils/swagger';
import { gracefulShutdown } from './utils/graceful-shutdown';
import { AllExceptionsFilter } from './exception/all-exception.filter';
import { ResponseInterceptor } from './interceptor/response.interceptor';

async function bootstrap(): Promise<void> {
  dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
  // Create the NestJS application and setup Winston logging.
  const app = await NestFactory.create(AppModule, {
    logger: initializeLogger(),
  });

  // Get the HttpAdapterHost to use with the AllExceptionsFilter.
  const httpAdapter = app.get(HttpAdapterHost);

  // Set the global prefix to '/api' and enable CORS.
  app.setGlobalPrefix('/api');
  app.enableCors();

  // Setting the limit option to 50MB allows the server to handle JSON payloads with a size of up to 50 megabytes
  app.use(json({ limit: '50mb' }));

  // Setting the  globally interceptor
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

  // Use the ResponseInterceptor and AllExceptionsFilter globally.
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Use the ValidationPipe globally with whitelist set to true.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Initialize Swagger
  initializeSwagger(app);

  // Setup graceful shutdown
  gracefulShutdown(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
