import { PaymentMethod } from "./user";

export interface IOrder {
  order: {
    name: String;
    amount: Number;
    ptice: Number;
  };
  nameOfBuyer: String;
  paymentMethod: PaymentMethod;
  sumPaid: Number;
  locationToDeliver: String;
  phone: String;
  notes?: String;
}
