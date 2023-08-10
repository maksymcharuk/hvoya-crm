import { DeliveryService } from '@shared/enums/delivery-service.enum';
import { OrderReturnRequestStatus } from '@shared/enums/order-return-request-status.enum';
import { DeliveryStatus } from '@shared/enums/return-request-delivery-status.enum';

import { BaseEntity } from './base.entity';
import { File } from './file.entity';
import { Order, OrderItem } from './order.entity';
import { User } from './user.entity';

export class OrderReturnRequest extends BaseEntity {
  deduction: number;
  total: number;
  status: OrderReturnRequestStatus;
  delivery: OrderReturnDeliveryEntity;
  order: Order;
  requestedItems: OrderReturnRequestItemEntity[];
  approvedItems: OrderReturnRequestItemEntity[];
  customer: User;

  constructor(data?: OrderReturnRequest) {
    super(data);
    this.deduction = data?.deduction || 0;
    this.total = data?.total || 0;
    this.delivery = data?.delivery || new OrderReturnDeliveryEntity();
    this.order = data?.order || new Order();
    this.requestedItems = data?.requestedItems || [];
    this.approvedItems = data?.approvedItems || [];
    this.customer = data?.customer || new User();
    this.status = data?.status || OrderReturnRequestStatus.Pending;
  }
}

export class OrderReturnRequestItemEntity extends BaseEntity {
  quantity: number;
  orderItem: OrderItem;
  orderReturnRequested: OrderReturnRequest;
  orderReturnApproved: OrderReturnRequest;

  constructor(data?: OrderReturnRequestItemEntity) {
    super(data);
    this.quantity = data?.quantity || 0;
    this.orderItem = data?.orderItem || new OrderItem();
    this.orderReturnRequested =
      data?.orderReturnRequested || new OrderReturnRequest();
    this.orderReturnApproved =
      data?.orderReturnApproved || new OrderReturnRequest();
  }
}

export class OrderReturnDeliveryEntity extends BaseEntity {
  trackingId: string;
  waybill: File | null;
  deliveryService: DeliveryService;
  rawStatus: string;
  status: DeliveryStatus;

  constructor(data?: OrderReturnDeliveryEntity) {
    super(data);
    this.trackingId = data?.trackingId || '';
    this.waybill = data?.waybill ? new File(data?.waybill) : null;
    this.deliveryService = data?.deliveryService || DeliveryService.NovaPoshta;
    this.rawStatus = data?.rawStatus || '';
    this.status = data?.status || DeliveryStatus.Pending;
  }
}
