import { z } from "zod";

const loginValidation = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number format"),
  password: z
    .string()
    .min(6, "Password must be more than 6 characters!")
    .max(16, "Password max length is 16 characters!")
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,16}$/, {
      message:
        "Passwrod must contain 1 number, 1 special sign, 1 capital letter and be 6-16 characters",
    }),
});

export default loginValidation;
