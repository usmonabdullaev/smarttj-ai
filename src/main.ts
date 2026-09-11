import { NestFactory } from '@nestjs/core';

import { LoggerService } from './logger/logger.service.js';
import { AppModule } from './app.module.js';

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const PREFIX = 'v1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new LoggerService('Main');

  app.setGlobalPrefix(PREFIX);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
  });

  await app.listen(PORT, HOST, () =>
    logger.log(
      `AI service successfully started in: http://${HOST}:${PORT}/${PREFIX},`,
      null,
      { save: false },
    ),
  );
}

await bootstrap();
