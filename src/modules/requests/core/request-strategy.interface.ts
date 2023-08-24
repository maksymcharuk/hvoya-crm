import { QueryRunner } from 'typeorm';

import { ApproveReturnRequestDto } from '@dtos/approve-return-request.dto';
import { CreateRequestDto } from '@dtos/create-request.dto';
import { RejectReturnRequestDto } from '@dtos/reject-return-request.dto';
import { UpdateRequestByCustomerDto } from '@dtos/update-request-by-customer.dto';
import { RequestEntity } from '@entities/request.entity';

/**
 * The Strategy interface declares operations common to all supported versions
 * of some algorithm.
 *
 * The Context uses this interface to call the algorithm defined by Concrete
 * Strategies.
 */
export interface RequestStrategy {
  createRequest(
    queryRunner: QueryRunner,
    userId: string,
    createRequestDto: CreateRequestDto,
    waybillScan?: Express.Multer.File,
    customerImages?: Express.Multer.File[],
  ): Promise<RequestEntity>;

  approveRequest(
    queryRunner: QueryRunner,
    userId: string,
    requestNumber: string,
    approveRequestDto: ApproveReturnRequestDto,
    managerImages?: Express.Multer.File[],
  ): Promise<RequestEntity>;

  rejectRequest(
    queryRunner: QueryRunner,
    userId: string,
    requestNumber: string,
    approveRequestDto: RejectReturnRequestDto,
    managerImages?: Express.Multer.File[],
  ): Promise<RequestEntity>;

  updateRequestByCustomer(
    queryRunner: QueryRunner,
    userId: string,
    requestNumber: string,
    updateRequestByCustomerDto: UpdateRequestByCustomerDto,
    waybill?: Express.Multer.File,
  ): Promise<RequestEntity>;
}
