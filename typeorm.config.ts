import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { resolve } from 'path';

config();

const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [resolve(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [resolve(__dirname, 'src/**/database/migrations/**/*{.ts,.js}')],
  seeds: [resolve(__dirname, 'src/**/database/seeds/**/*{.ts,.js}')],
  factories: [resolve(__dirname, 'src/**/database/factories/**/*{.ts,.js}')],
};

export const dataSource = new DataSource(options);
