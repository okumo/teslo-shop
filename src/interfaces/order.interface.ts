import { Address } from "./address.interface";
import { Size } from "./product.interface";

export interface OrderBase {
  id: string;
  subTotal: number;
  tax: number;
  total: number;
  itemsInOrder: number;
  isPaid: boolean;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ProductToOrder {
  productId: string;
  size: Size;
  quantity: number;
}

export interface OrderInformation extends OrderBase {
  OrderAddress: Address;
  OrderItem: ProductToOrder[];
}
