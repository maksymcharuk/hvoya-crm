import { RequestType } from '@shared/enums/request-type.enum';

import { BaseEntity } from './base.entity';
import { File } from './file.entity';
import { OrderReturnRequest } from './order-return-request.entity';
import { User } from './user.entity';

export class RequestEntity extends BaseEntity {
  number: string;
  customerComment: string;
  managerComment: string;
  requestType: RequestType;
  requestId: number;
  returnRequest: OrderReturnRequest;
  customer: User;
  customerImages: File[];
  managerImages: File[];

  constructor(data?: RequestEntity) {
    super(data);
    this.customerComment = data?.customerComment || '';
    this.managerComment = data?.managerComment || '';
    this.customer = new User(data?.customer);
    this.requestType = data?.requestType || RequestType.Return;
    this.requestId = data?.requestId || 0;
    this.returnRequest = new OrderReturnRequest(data?.returnRequest);
    this.number = data?.number || '';
    this.customerImages = data?.customerImages?.map((i) => new File(i)) || [];
    this.managerImages = data?.managerImages?.map((i) => new File(i)) || [];
  }
}
