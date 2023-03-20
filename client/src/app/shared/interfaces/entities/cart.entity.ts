import { BaseEntity } from './base.entity';
import { ProductVariant } from './product.entity';

export class CartItem extends BaseEntity {
  product: ProductVariant;
  quantity: number;

  constructor(data?: CartItem) {
    super(data);
    this.product = new ProductVariant(data?.product);
    this.quantity = data?.quantity || 0;
  }
}

export class Cart extends BaseEntity {
  items: CartItem[];
  total: number;

  constructor(data?: Cart) {
    super(data);
    this.items = data?.items.map((item) => new CartItem(item)) || [];
    this.total = data?.total || 0;
  }
}
