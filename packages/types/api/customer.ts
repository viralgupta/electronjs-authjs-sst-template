import { z } from "zod";

export const createCustomerSchema = z
  .object({
    name: z.string().min(2, "Name too short"),
    balance: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0.00, {
        message: "The number must be greater than or equal to 0.00",
      }),
    country_code: z.string().min(1, "Country code too short").optional(),
    phone_number: z.string().min(10, "Phone number too short"),
    whatsappChatId: z.string().optional(),
  })
  .strict("Too many fields in request body");
