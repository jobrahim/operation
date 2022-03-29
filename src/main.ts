import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');
  app.enableCors();
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('TCP_HOST'),
      port: configService.get('TCP_PORT'),
      retryAttempts: 3,
      retryDelay: 500,
    },
  });
  const options = new DocumentBuilder()
    .setTitle('Operations')
    .setDescription('Endpoint para indexado de Operaciones  (Operation Index)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('operation-order/api/', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
