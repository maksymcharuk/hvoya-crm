import { config } from 'dotenv';
import * as fs from 'fs';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

import { Env } from './enums/env.enum';

const newrelicFormatter = require('@newrelic/winston-enricher')(winston);

config({
  path: `env/${process.env['NODE_ENV'] === 'test' ? 'test.env' : '.env'}`,
});

export default () => {
  // Configs
  const HTTPS_OPTIONS = {
    cert: process.env['CERT_PATH']
      ? fs.readFileSync(process.env['CERT_PATH'])
      : '',
    key: process.env['KEY_PATH']
      ? fs.readFileSync(process.env['KEY_PATH'])
      : '',
    ca: process.env['CA_PATH'] ? fs.readFileSync(process.env['CA_PATH']) : '',
    requestCert: true,
    rejectUnauthorized: false,
  };

  // Constants
  const APP_ORIGIN = new Map([
    ['development', 'http://localhost:4200'],
    ['test', 'http://localhost:4201'],
    ['staging', 'https://sales.hvoya.com'],
    ['production', 'https://sales.hvoya.com'],
  ]);

  // Helpers
  const isProduction = () => process.env['NODE_ENV'] === Env.Production;
  const isStaging = () => process.env['NODE_ENV'] === Env.Staging;
  const isDevelopment = () => process.env['NODE_ENV'] === Env.Development;
  const isTest = () => process.env['NODE_ENV'] === Env.Test;

  // Logger
  const getLoggerConfigs = () => {
    const formatters = [
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('Hvoya CRM', {
        colors: true,
        prettyPrint: true,
      }),
    ];

    if (process.env['NEW_RELIC_ENABLED'] === 'true') {
      formatters.unshift(newrelicFormatter());
    }

    return {
      format: winston.format.combine(...formatters),
    };
  };

  const LOGGER = WinstonModule.createLogger({
    transports: [new winston.transports.Console(getLoggerConfigs())],
  });

  return {
    APP_ORIGIN,
    HTTPS_OPTIONS,
    LOGGER,
    isProduction,
    isStaging,
    isDevelopment,
    isTest,
  };
};
