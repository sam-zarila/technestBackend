import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (Important for frontend requests)
  app.enableCors();

  // Load environment variables using ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger available at /api

  await app.listen(port);
  console.log(`✅ Application is running on: http://localhost:${port}/api`);
}

bootstrap();
