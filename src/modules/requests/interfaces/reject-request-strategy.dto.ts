import { QueryRunner } from 'typeorm';

import { RejectRequestDto } from '@dtos/requests/reject-request.dto';

export interface RejectRequestContextDto {
  userId: string;
  requestNumber: string;
  rejectRequestDto: RejectRequestDto;
  document?: Express.Multer.File;
  images?: Express.Multer.File[];
}

export type RejectRequestStrategyDto = RejectRequestContextDto & {
  queryRunner: QueryRunner;
};
