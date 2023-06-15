import { Cart } from '../entities/cart.entity';

export interface OrderCreateResponseError {
  error: {
    message: string;
    cart?: Cart;
  };
}
