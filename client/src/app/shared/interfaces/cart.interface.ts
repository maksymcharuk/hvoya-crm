import { ProductVariant } from './products';

export interface CartItem {
  product: ProductVariant;
  quantity: number;
}

export interface Cart {
  cartItems: CartItem[];
  total: number;
}
