import { SeederOptions } from 'typeorm-extension';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { ConfigService } from '@nestjs/config';

import config from '../../../config';

config();

const configService = new ConfigService();

export const options: PostgresConnectionOptions & SeederOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
};
