import { PaymentMethod } from "./user";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}
export interface IOrder {
  order: OrderItem[];
  nameOfBuyer: string;
  paymentMethod: PaymentMethod;
  sumPaid: number;
  locationToDeliver: string;
  phone: string;
  notes?: string;
}
