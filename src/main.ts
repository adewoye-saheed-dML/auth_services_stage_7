import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- SWAGGER CONFIGURATION STARTS HERE ---
  const config = new DocumentBuilder()
    .setTitle('Auth & API Key Service')
    .setDescription('The API description for Task 3')
    .setVersion('1.0')
    // 1. Add support for JWT (Bearer)
    .addBearerAuth()
    // 2. Add support for API Keys
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // --- SWAGGER CONFIGURATION ENDS HERE ---

  await app.listen(3000);
}
bootstrap();