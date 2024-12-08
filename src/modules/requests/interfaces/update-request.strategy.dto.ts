import { QueryRunner } from 'typeorm';

import { UpdateRequestDto } from '@dtos/requests/update-request.dto';

export interface UpdateRequestContextDto {
  userId: string;
  requestNumber: string;
  updateRequestDto: UpdateRequestDto;
  document?: Express.Multer.File;
  images?: Express.Multer.File[];
}

export type UpdateRequestStrategyDto = UpdateRequestContextDto & {
  queryRunner: QueryRunner;
};
