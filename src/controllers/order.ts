//todo

import { Request, Response } from "express-serve-static-core";
import helper from "../helper";
import { ExtendedUser } from "../models/typesOrInterfaces/user";
import Order from "../models/order.schema";
import { IOrder } from "../models/typesOrInterfaces/order";
// add order
const addOrder = async (
  req: Request<{}, {}, IOrder>,
  res: Response<IOrder>
) => {
  const { order, locationToDeliver, phone, notes, paymentMethod } = req.body;

  const { _id, name, location, phoneNumber } = (req as unknown as ExtendedUser)
    .user;

  let sumPaid: number = 0;

  for (let i = 0; i < order.length; i++) {
    sumPaid = sumPaid + order[i].price * order[i].quantity;
  }

  const newOrder: IOrder = {
    order,
    nameOfBuyer: name,
    paymentMethod,
    locationToDeliver: location || locationToDeliver,
    phone: phoneNumber || phone,
    notes,
    sumPaid,
  };

  const newOrderWrite = await Order.create(newOrder);

  return res.status(201).json(newOrderWrite);
};

export default {
  addOrder: helper.ctrlWrapper(addOrder),
};
