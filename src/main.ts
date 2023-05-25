import * as compression from 'compression';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as rateLimit from 'express-rate-limit';
import * as xmlparser from 'express-xml-bodyparser';
import * as fs from 'fs';
import helmet from 'helmet';
import * as https from 'https';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as newrelic from 'newrelic';
import * as nocache from 'nocache';
import * as winston from 'winston';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { ExtendedSocketIoAdapter } from '@adapters/extended-socket-io.adapter';
import { Env } from '@enums/env.enum';

import { AppModule } from './app.module';
import { appOrigin } from './config';

const newrelicFormatter = require('@newrelic/winston-enricher')(winston);

dotenv.config();

const configs = {
  format: winston.format.combine(
    newrelicFormatter(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike('Hvoya CRM', {
      colors: true,
      prettyPrint: true,
    }),
  ),
};

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
  const logger = WinstonModule.createLogger({
    transports: [new winston.transports.Console(configs)],
  });
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger,
  });
  const configService = app.get(ConfigService);
  const httpsServer = https.createServer(httpsOptions, server);

  app.useWebSocketAdapter(new ExtendedSocketIoAdapter(httpsServer, logger));

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

  // Other configs
  if (
    configService.get('NODE_ENV') === Env.Production ||
    configService.get('NODE_ENV') === Env.Staging
  ) {
    const loaded = newrelic.instrumentLoadedModule('express', server);
    logger.log('New Relic loaded: ' + loaded);
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
  app.use(xmlparser());

  await app.init();

  httpsServer.listen(configService.get('PORT') || '3000');
}
bootstrap();
