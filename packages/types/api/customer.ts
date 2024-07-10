import { z } from "zod";
import { phone_numberType } from "./miscellaneous";

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

export const createCustomerType = z
  .object({
    name: z.string().min(2, "Name too short"),
    balance: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0.0, {
        message: "The number must be greater than or equal to 0.00",
      }),
    profileUrl: z.string().optional(),
    phone_numbers: z
      .array(phone_numberType)
      .min(1, "At least one phone number is required"),
    addresses: z.array(addressType),
  })
  .strict("Too many fields in request body");

export const addAddressType =  addressType.extend({
  customer_id: z.string()
})

export const editCustomerType = createCustomerType.omit({
  phone_numbers: true,
  addresses: true,
  balance: true
}).extend({
  customer_id: z.string()
}).partial({
  name: true,
  profileUrl: true
}).refine((vals) => {
  if (!vals.name && !vals.profileUrl){
    return false;
  }
}, "At least one field is required to update customer")

export const settleBalanceType = z.object({
  customer_id: z.string(),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0.00, {
      message: "The amount must be greater than or equal to 0.00",
    })
    .transform((val) => parseFloat(val)),
  operation: z.enum(["add", "subtract"]),
}).strict("Too many fields in request body");