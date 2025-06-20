import { z } from "zod";

const cardPaymentSchema = z.object({
  type: z.literal("card"),
  cardHolderName: z.string(),
  brand: z.string(),
  expiryMonth: z.string(),
  expiryYear: z.string(),
  cardNumber: z.string(),
  cvc: z.string(),
  token: z.string().optional(),
  email: z.string().optional(),
});

const paypalPaymentSchema = z.object({
  type: z.literal("paypal"),
  email: z.string().email(),
});

const orderValidation = z.object({
  order: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
  nameOfBuyer: z.string().optional(),
  paymentMethod: z.discriminatedUnion("type", [
    cardPaymentSchema,
    paypalPaymentSchema,
  ]),
  locationToDeliver: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().max(256, "Must be less than 256 characters").optional(),
});

export default orderValidation;
