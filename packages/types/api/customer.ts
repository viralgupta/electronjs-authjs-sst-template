import { z } from "zod";

export const createCustomerSchema = z
  .object({
    name: z.string().min(2, "Name too short"),
    balance: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0.0, {
        message: "The number must be greater than or equal to 0.00",
      }),
    phone_numbers: z.array(
      z.object({
        phone_number: z.string().length(10, "Phone number not of length 10"),
        country_code: z.string().min(1, "Country code too short").max(5, "Country code too long").optional(),
        whatsappChatId: z.string().max(20, "Whatsapp Chat Id too long").optional(),
        isPrimary: z.boolean().optional().default(false),
      })
    ).min(1, "At least one phone number is required")
  })
  .strict("Too many fields in request body");
