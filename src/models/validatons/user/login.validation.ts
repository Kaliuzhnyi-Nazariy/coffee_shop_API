import { z } from "zod/v4";

const loginValidation = z.object({
  phoneNumber: z
    .string("Phone number is obvious")
    .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number format"),
  password: z
    .string("Password is obvious")
    .min(6, "Password must be more than 6 characters!")
    .max(16, "Password max length is 16 characters!")
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,16}$/, {
      message:
        "Must contain 1 number, 1 special sign, 1 capital letter and be 6-16 characters",
    }),
});

export default loginValidation;
