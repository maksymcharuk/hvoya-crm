import { readFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';

import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  // package.json sits in the release root (pm2 cwd) in production and the
  // repo root in development.
  private readonly version: string = (() => {
    try {
      return JSON.parse(
        readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
      ).version;
    } catch {
      return 'unknown';
    }
  })();

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getHealth() {
    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'down',
      });
    }

    return {
      status: 'ok',
      version: this.version,
      uptime: Math.round(process.uptime()),
    };
  }
}
