import { QueryRunner } from 'typeorm';

import { UpdateRequestByCustomerDto } from '@dtos/requests/update-request-by-customer.dto';

export interface UpdateRequestByCustomerContextDto {
  userId: string;
  requestNumber: string;
  updateRequestByCustomerDto: UpdateRequestByCustomerDto;
  document?: Express.Multer.File;
  images?: Express.Multer.File[];
}

export type UpdateRequestByCustomerStrategyDto =
  UpdateRequestByCustomerContextDto & {
    queryRunner: QueryRunner;
  };
