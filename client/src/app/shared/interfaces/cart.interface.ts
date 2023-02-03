import { ProductVariant } from './products';

export interface CartItem {
  id: number;
  product: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
