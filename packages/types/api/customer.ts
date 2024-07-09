import { z } from "zod";
import { phone_numberSchema } from "./miscellaneous";

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
      phone_numberSchema
    ).min(1, "At least one phone number is required"),
    addresses: z.array(
      addAddressSchema
    )
  })
  .strict("Too many fields in request body");

