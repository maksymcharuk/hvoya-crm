import * as compression from 'compression';
import * as express from 'express';
import * as xmlparser from 'express-xml-bodyparser';
import helmet from 'helmet';
import * as http from 'http';
import * as nocache from 'nocache';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { ExtendedSocketIoAdapter } from '@adapters/extended-socket-io.adapter';
import { Env } from '@enums/env.enum';

import { SetupService } from '@modules/setup/services/setup.service';

import { AppModule } from './app.module';
import config from './config';

const { APP_ORIGIN, LOGGER, isProduction } = config();

const logger = LOGGER;

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger,
  });

  server.set('trust proxy', 1);

  const httpServer = http.createServer(server);

  const setupService = app.get(SetupService);
  await setupService.setup();

  // Security configs
  if (isProduction()) {
    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
    app.use(nocache());
    app.use(compression());
  }

  // Other configs
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
  app.useWebSocketAdapter(new ExtendedSocketIoAdapter(httpServer, logger));

  await app.init();

  httpServer.listen(process.env['PORT'] || 8080, () => {
    // Tells pm2 (wait_ready mode) the new process can take traffic, so the
    // old one is only killed once this release is actually serving.
    process.send?.('ready');
  });

  const shutdown = async (signal: string) => {
    logger.log(`${signal} received, shutting down gracefully`);
    // pm2's kill_timeout force-kills us if this hangs (e.g. open websockets)
    httpServer.close();
    await app.close();
    process.exit(0);
  };
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap()
  .then(() => {
    logger.log(
      `Application listening on port ${process.env['PORT'] || '8080'}`,
    );
  })
  .catch((error) => {
    logger.error(error);
  });
