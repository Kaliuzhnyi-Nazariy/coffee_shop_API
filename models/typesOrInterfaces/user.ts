export interface IUser {
  name: string;
  email: string;
  password: string;
  favorites?: string[];
  location?: string;
  paymentMethods?: PaymentMethod[];
}

export interface PaymentMethod {
  name: string;
  number: string;
}

export type PaymentArrays = PaymentMethod[];
