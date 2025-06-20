import { model, Schema } from "mongoose";
import { PaymentSchema } from "./user.model";
import helper from "../helper";
import { IOrder } from "./typesOrInterfaces/order";

const orderSchema = new Schema({
  name: String,
  quantity: Number,
  ptice: Number,
});

const orderNoteSchema = new Schema({
  order: { type: [orderSchema], required: true },
  nameOfBuyer: { type: String, required: true },
  paymentMethod: { type: PaymentSchema, required: true },
  sumPaid: { type: Number, required: true },
  locationToDeliver: { type: String, required: true },
  phone: String,
  notes: { type: String, length: 256 },
});

(orderNoteSchema as any).post("save", helper.MongooseErrorHandler);

const Order = model<IOrder>("order", orderNoteSchema);

export default Order;
