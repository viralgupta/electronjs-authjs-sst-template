import { z } from "zod";

export const phone_numberType = z.object({
  customer_id: z.string().optional(),
  architect_id: z.string().optional(),
  carpanter_id: z.string().optional(),
  driver_id: z.string().optional(),  
  phone_number: z.string().length(10, "Phone number not of length 10"),
  country_code: z.string().min(1, "Country code too short").max(5, "Country code too long").optional(),
  whatsappChatId: z.string().max(20, "Whatsapp Chat Id too long").optional(),
  isPrimary: z.boolean().optional().default(false),
})

export const addressType = z
  .object({
    address: z.string().max(256, "Address too long"),
    city: z.string().max(30, "City too long"),
    state: z.string().max(20, "State too long"),
    pincode: z.string().max(8, "Pincode too long"),
    isPrimary: z.boolean().default(false),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })
  .strict("Too many fields in request body");