import { QueryRunner } from 'typeorm';

import { CreateRequestDto } from '@dtos/requests/create-request.dto';

export interface CreateRequestContextDto {
  userId: string;
  createRequestDto: CreateRequestDto;
  document?: Express.Multer.File;
  images?: Express.Multer.File[];
}

export type CreateRequestStrategyDto = CreateRequestContextDto & {
  queryRunner: QueryRunner;
};
