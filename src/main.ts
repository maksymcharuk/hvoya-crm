import * as compression from 'compression';
import * as dotenv from 'dotenv';
import * as rateLimit from 'express-rate-limit';
import * as xmlparser from 'express-xml-bodyparser';
import * as fs from 'fs';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import * as nocache from 'nocache';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { Env } from '@enums/env.enum';

import { AppModule } from './app.module';
import { appOrigin } from './config';

dotenv.config();

const httpsOptions = {
  cert: process.env['CERT_PATH']
    ? fs.readFileSync(process.env['CERT_PATH'])
    : '',
  key: process.env['KEY_PATH'] ? fs.readFileSync(process.env['KEY_PATH']) : '',
  ca: process.env['CA_PATH'] ? fs.readFileSync(process.env['CA_PATH']) : '',
  requestCert: true,
  rejectUnauthorized: false,
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    httpsOptions,
  });
  const configService = app.get(ConfigService);

  // Security configs
  if (configService.get('NODE_ENV') === Env.Production) {
    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
    app.use(
      (rateLimit as any)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );
    app.use(nocache());
    app.use(compression());
  }

  app.enableCors({
    origin: appOrigin.get(configService.get('NODE_ENV') || Env.Development),
  });
  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useLogger(app.get(Logger));
  app.use(xmlparser());

  await app.listen(configService.get('PORT') || '3000');
}
bootstrap();
