import * as compression from 'compression';
import * as express from 'express';
import * as rateLimit from 'express-rate-limit';
import * as xmlparser from 'express-xml-bodyparser';
import helmet from 'helmet';
import * as http from 'http';
import * as https from 'https';
import * as newrelic from 'newrelic';
import * as nocache from 'nocache';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { ExtendedSocketIoAdapter } from '@adapters/extended-socket-io.adapter';
import { Env } from '@enums/env.enum';

import { SetupService } from '@modules/setup/services/setup.service';

import { AppModule } from './app.module';
import config from './config';

const { APP_ORIGIN, HTTPS_OPTIONS, LOGGER, isProduction } = config();

const logger = LOGGER;

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger,
  });
  const httpsServer = https.createServer(HTTPS_OPTIONS, server);

  const setupService = app.get(SetupService);
  await setupService.setup();

  // Security configs
  if (isProduction()) {
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
  if (process.env['NEW_RELIC_ENABLED'] === 'true') {
    const loaded = newrelic.instrumentLoadedModule('express', server);
    logger.log('New Relic loaded: ' + loaded);
  }
  app.enableCors({
    origin: APP_ORIGIN.get(process.env['NODE_ENV'] || Env.Development),
  });
  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.use(xmlparser());
  app.useWebSocketAdapter(new ExtendedSocketIoAdapter(httpsServer, logger));

  await app.init();

  http.createServer(server).listen(process.env['PORT'] || 80);
  httpsServer.listen(process.env['HTTPS_PORT'] || 443);
}

bootstrap()
  .then(() => {
    logger.log(`Application listening on port ${process.env['PORT'] || '80'}`);
  })
  .catch((error) => {
    logger.error(error);
  });
