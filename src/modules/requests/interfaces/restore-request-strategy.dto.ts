import { QueryRunner } from 'typeorm';

export interface RestoreRequestContextDto {
  userId: string;
  requestNumber: string;
}

export type RestoreRequestStrategyDto = RestoreRequestContextDto & {
  queryRunner: QueryRunner;
};
