import { DeliveryService } from '@shared/enums/delivery-service.enum';
import { OrderDeliveryStatus } from '@shared/enums/order-delivery-status.enum';
import { OrderStatus } from '@shared/enums/order-status.enum';

import { BaseEntity } from './base.entity';
import { File } from './file.entity';
import { NotificationEntity } from './notification.entity';
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

export class Order extends BaseEntity {
  items: OrderItem[];
  delivery: OrderDelivery;
  status: OrderStatus;
  number: number;
  total?: number;
  customer: User;
  notification: NotificationEntity | undefined;

  constructor(data?: Order) {
    super(data);
    this.items = data?.items?.map((item) => new OrderItem(item)) || [];
    this.delivery = new OrderDelivery(data?.delivery);
    this.status = data?.status || OrderStatus.Pending;
    this.number = data?.number || 0;
    this.total = data?.total;
    this.customer = new User(data?.customer);
    this.notification = undefined;
  }
}
