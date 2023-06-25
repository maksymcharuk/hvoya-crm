import { DeliveryService } from '@shared/enums/delivery-service.enum';
import { OrderDeliveryStatus } from '@shared/enums/order-delivery-status.enum';
import { OrderStatus as OrderStatusEnum } from '@shared/enums/order-status.enum';

import { BaseEntity } from './base.entity';
import { File } from './file.entity';
import { ProductProperties, ProductVariant } from './product.entity';
import { User } from './user.entity';

export class OrderDelivery extends BaseEntity {
  trackingId?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phoneNumber?: string;
  deliveryService?: DeliveryService;
  deliveryType?: string;
  status: OrderDeliveryStatus;
  rawStatus: string;
  city?: string;
  postOffice?: string;
  waybill?: File | null;

  constructor(data?: OrderDelivery) {
    super(data);
    this.trackingId = data?.trackingId;
    this.firstName = data?.firstName;
    this.lastName = data?.lastName;
    this.middleName = data?.middleName;
    this.phoneNumber = data?.phoneNumber;
    this.deliveryService = data?.deliveryService;
    this.deliveryType = data?.deliveryType;
    this.status = data?.status || OrderDeliveryStatus.Pending;
    this.rawStatus = data?.rawStatus || '';
    this.city = data?.city;
    this.postOffice = data?.postOffice;
    this.waybill = data?.waybill ? new File(data?.waybill) : null;
  }
}

export class OrderItem extends BaseEntity {
  product: ProductVariant;
  productProperties: ProductProperties;
  quantity: number;

  constructor(data?: OrderItem) {
    super(data);
    this.product = new ProductVariant(data?.product);
    this.productProperties = new ProductProperties(data?.productProperties);
    this.quantity = data?.quantity || 0;
  }
}

export class OrderStatus extends BaseEntity {
  status: OrderStatusEnum;
  comment: string;
  createdBy: User | null;

  constructor(data?: OrderStatus) {
    super(data);
    this.status = data?.status || OrderStatusEnum.Pending;
    this.comment = data?.comment || '';
    this.createdBy = data?.createdBy ? new User(data?.createdBy) : null;
  }
}

export class Order extends BaseEntity {
  items: OrderItem[];
  delivery: OrderDelivery;
  statuses: OrderStatus[];
  number: number;
  total?: number;
  customer: User;
  customerNote?: string;
  managerNote?: string;


  get currentStatus(): OrderStatus {
    return this.statuses.length ? this.statuses[0]! : new OrderStatus();
  }

  constructor(data?: Order) {
    super(data);
    this.items = data?.items?.map((item) => new OrderItem(item)) || [];
    this.delivery = new OrderDelivery(data?.delivery);
    this.statuses =
      data?.statuses?.map((status) => new OrderStatus(status)) || [];
    this.number = data?.number || 0;
    this.total = data?.total;
    this.customer = new User(data?.customer);
    this.customerNote = data?.customerNote;
    this.managerNote = data?.managerNote;
  }
}
