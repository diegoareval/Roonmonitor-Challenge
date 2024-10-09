import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS configuration
  app.enableCors({
    origin: [],
  });
  // Cookie parser
  app.use(cookieParser());
  // Versioning
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Tiny Store REST API')
    .setDescription('RAVN Challenge v2')
    .setVersion('1.0')
    .setContact(
      'Diego Arevalo',
      'https://github.com/diegoareval',
      'diego2000avelar@gmail.com',
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  // Start app
  await app.listen(process.env.PORT || 3000);
  Logger.log(
    'App running on port 3000. Documentation at http://localhost:3000/api-docs',
    'Bootstrap',
  );
}
bootstrap();
