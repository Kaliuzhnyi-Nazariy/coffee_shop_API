import { z } from "zod/v4";

const createUserValidation = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  password: z
    .string()
    .min(6, "Password must be more than 6 characters!")
    .max(16, "Password max length is 16 characters!")
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,16}$/, {
      message:
        "Must contain 1 number, 1 special sign, 1 capital letter and be 6-16 characters",
    }),
  location: z.string().optional(),
});

export default createUserValidation;
