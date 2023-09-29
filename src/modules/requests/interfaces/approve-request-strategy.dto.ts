import { QueryRunner } from 'typeorm';

import { ApproveRequestDto } from '@dtos/requests/approve-request.dto';

export interface ApproveRequestContextDto {
  userId: string;
  requestNumber: string;
  approveRequestDto: ApproveRequestDto;
  images?: Express.Multer.File[];
  document?: Express.Multer.File;
}

export type ApproveRequestStrategyDto = ApproveRequestContextDto & {
  queryRunner: QueryRunner;
};
