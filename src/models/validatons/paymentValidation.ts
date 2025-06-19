import { z } from "zod/v4";

const CardSchema = z.object({
  type: z.literal("card"),
  cardNumber: z.string().min(12),
  cvc: z.string().length(3),
  brand: z.string(),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.string(),
});

const PayPalSchema = z.object({
  type: z.literal("paypal"),
  email: z.email(),
});

const paymentValidation = z.discriminatedUnion("type", [
  CardSchema,
  PayPalSchema,
]);

export default paymentValidation;
