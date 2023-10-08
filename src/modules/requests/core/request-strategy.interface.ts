import { RequestEntity } from '@entities/request.entity';

import { ApproveRequestStrategyDto } from '../interfaces/approve-request-strategy.dto';
import { CreateRequestStrategyDto } from '../interfaces/create-request-strategy.dto';
import { RejectRequestStrategyDto } from '../interfaces/reject-request-strategy.dto';
import { UpdateRequestByCustomerStrategyDto } from '../interfaces/update-request-by-customer.strategy.dto';

/**
 * The Strategy interface declares operations common to all supported versions
 * of some algorithm.
 *
 * The Context uses this interface to call the algorithm defined by Concrete
 * Strategies.
 */
export interface RequestStrategy {
  createRequest(data: CreateRequestStrategyDto): Promise<RequestEntity>;
  approveRequest(data: ApproveRequestStrategyDto): Promise<RequestEntity>;
  rejectRequest(data: RejectRequestStrategyDto): Promise<RequestEntity>;
  updateRequestByCustomer(
    data: UpdateRequestByCustomerStrategyDto,
  ): Promise<RequestEntity>;
}
