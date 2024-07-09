import { z } from "zod";

export const phone_numberSchema = z.object({
  customer_id: z.string().optional(),
  architect_id: z.string().optional(),
  carpanter_id: z.string().optional(),
  driver_id: z.string().optional(),  
  phone_number: z.string().length(10, "Phone number not of length 10"),
  country_code: z.string().min(1, "Country code too short").max(5, "Country code too long").optional(),
  whatsappChatId: z.string().max(20, "Whatsapp Chat Id too long").optional(),
  isPrimary: z.boolean().optional().default(false),
})