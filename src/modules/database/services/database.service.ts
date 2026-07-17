import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import { createReadStream, createWriteStream, unlink } from 'fs';
import { Readable } from 'stream';

import { Injectable } from '@nestjs/common';

import { options } from '../configs/db.configs';

@Injectable()
export class DatabaseService {
  static localFileName = 'backup.dump';
  static backupsToKeep = 15;
  static s3Client = new S3Client({
    region: process.env['AWS_BUCKET_REGION'] || 'blank',
  });

  static async backup() {
    await this.pgBackup();
    await this.uploadDumpToS3();
    await this.deleteLocalFile();
    await this.cleanupOldBackups();
  }

  static async restore() {
    await this.downloadDumpFromS3();
    await this.pgRestore();
    await this.deleteLocalFile();
  }

  private static async pgBackup(): Promise<void> {
    return this.execute(
      `pg_dump -h ${options.host} -U ${options.username} -p ${options.port} -Fc -f ${this.localFileName} ${options.database}`,
    );
  }

  private static async pgRestore(): Promise<any> {
    const dropDB = `psql -h ${options.host} -U ${options.username} -p ${options.port} -c "DROP DATABASE ${options.database};"`;
    const createDB = `psql -h ${options.host} -U ${options.username} -p ${options.port} -c "CREATE DATABASE ${options.database};"`;
    const restoreDB = `pg_restore -h ${options.host} -p ${options.port} -U ${options.username} -d ${options.database} ./${this.localFileName}`;

    try {
      await this.execute(dropDB);
    } catch (error) {
      console.log('Failed to drop database!', error);
    }

    await this.execute(createDB);
    // Exit code 1 means pg_restore completed with warnings (e.g. unrecognized
    // config params from a newer PG version dump). Treat it as success.
    await this.execute(restoreDB, [1]);
  }

  private static async execute(
    command: string,
    allowExitCodes: number[] = [],
  ): Promise<void> {
    process.env['PGPASSWORD'] = options.password as string;

    return new Promise((resolve, reject) => {
      exec(command, (error) => {
        if (error) {
          if (error.code !== undefined && allowExitCodes.includes(error.code)) {
            resolve();
          } else {
            reject(error);
          }
        } else {
          resolve();
        }
      });
    });
  }

  private static async uploadDumpToS3() {
    const date = new Date();

    return this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env['AWS_BUCKET_NAME'] || '',
        Key: this.getS3FileName(date),
        Body: createReadStream(`./${this.localFileName}`),
      }),
    );
  }

  private static async downloadDumpFromS3(key?: string) {
    const list = await this.s3Client.send(
      new ListObjectsCommand({
        Bucket: process.env['AWS_BUCKET_NAME'] || '',
      }),
    );

    const lastBackup = list.Contents?.sort((a, b) => {
      if (a.LastModified && b.LastModified) {
        return a.LastModified > b.LastModified ? -1 : 1;
      }
      return 0;
    })[0];

    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: process.env['AWS_BUCKET_NAME'] || '',
        Key: key || lastBackup?.Key,
      }),
    );

    const stream = response.Body as Readable;

    const file = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.once('end', () => resolve(Buffer.concat(chunks)));
      stream.once('error', reject);
    });

    return new Promise<void>((resolve, reject) => {
      const fileStream = createWriteStream(`./${this.localFileName}`);
      fileStream.on('error', (error) => reject(error));
      fileStream.on('close', () => resolve());
      fileStream.write(file);
      fileStream.end();
    });
  }

  private static async cleanupOldBackups() {
    try {
      const list = await this.s3Client.send(
        new ListObjectsCommand({
          Bucket: process.env['AWS_BUCKET_NAME'] || '',
        }),
      );

      const stale = (list.Contents ?? [])
        .filter((object) => object.Key?.startsWith('backup-'))
        .sort((a, b) => {
          if (a.LastModified && b.LastModified) {
            return a.LastModified > b.LastModified ? -1 : 1;
          }
          return 0;
        })
        .slice(this.backupsToKeep);

      if (!stale.length) {
        return;
      }

      await this.s3Client.send(
        new DeleteObjectsCommand({
          Bucket: process.env['AWS_BUCKET_NAME'] || '',
          Delete: {
            Objects: stale.map((object) => ({ Key: object.Key })),
          },
        }),
      );

      console.log(`Removed ${stale.length} old backup(s) from S3`);
    } catch (error) {
      // A failed cleanup should not fail the backup (or a deploy) itself.
      console.error('Failed to clean up old backups!', error);
    }
  }

  private static getS3FileName(date: Date) {
    return `backup-${this.getFormattedDate(date)}.dump`;
  }

  private static getFormattedDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    return `${year}-${month}-${day}T${hour}:${minutes}`;
  }

  private static async deleteLocalFile() {
    return new Promise<void>((resolve, reject) => {
      unlink(`./${this.localFileName}`, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
