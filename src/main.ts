import * as compression from 'compression';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as rateLimit from 'express-rate-limit';
import * as xmlparser from 'express-xml-bodyparser';
import * as fs from 'fs';
import helmet from 'helmet';
import * as https from 'https';
import { Logger } from 'nestjs-pino';
import * as newrelic from 'newrelic';
import * as nocache from 'nocache';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { ExtendedSocketIoAdapter } from '@adapters/extended-socket-io.adapter';
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
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const configService = app.get(ConfigService);
  const httpsServer = https.createServer(httpsOptions, server);

  app.useWebSocketAdapter(new ExtendedSocketIoAdapter(httpsServer));

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

  newrelic.instrumentLoadedModule('express', server);

  await app.init();

  httpsServer.listen(configService.get('PORT') || '3000');
}
bootstrap();
