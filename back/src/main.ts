import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { applyGlobalConfig } from '@/global-config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import qs from 'qs';

async function bootstrap() {
  const adapter = new FastifyAdapter({
    querystringParser: (str) => qs.parse(str),
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  app.enableCors({
    origin: ['http://localhost:9000', 'http://localhost:9001'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Nest Auth Api')
    .setDescription(
      'The Nest Api support creating deleting editing and authenticating users',
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      name: 'Authorization',
      description: 'JWT token',
      in: 'Header',
      type: 'http',
      scheme: 'Bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  applyGlobalConfig(app);
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
