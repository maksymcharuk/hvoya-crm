// Must stay the first import: the agent instruments modules (express, http,
// pg, ...) by hooking require, so anything loaded before it is invisible to
// New Relic. Loading it here instead of via pm2 node_args matters because a
// node_args preload runs before pm2 chdirs into cwd, so the agent resolves
// newrelic.js/env/.env against the pm2 daemon's cwd and silently disables
// itself (bit us 2026-07-17..18). An import here runs after the chdir.
// Disabled outside production by NEW_RELIC_ENABLED in the env file.
import 'newrelic';

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
