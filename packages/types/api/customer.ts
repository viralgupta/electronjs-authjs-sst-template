import { z } from "zod";

export const addAddressSchema = z.object({
  address: z.string().max(256, "Address too long"),
  city: z.string().max(30, "City too long"),
  state: z.string().max(20, "State too long"),
  pincode: z.string().max(8, "Pincode too long"),
  isPrimary: z.boolean().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

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
    ).min(1, "At least one phone number is required"),
    addresses: z.array(
      addAddressSchema
    )
  })
  .strict("Too many fields in request body");