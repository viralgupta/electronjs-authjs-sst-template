import { z } from "zod";

export const orderItem = z.object({
  item_id: z.string(),
  quantity: z.number(),
  rate: z.number(),
  total_value: z.string()
  .refine((val) => !isNaN(parseFloat(val)) && parseFloat(parseFloat(val).toFixed(2)) >= 0.00, {
    message: "The number must be greater than or equal to 0.00",
  })
  .transform((val) => parseFloat(val).toFixed(2)),
  carpanter_commision:  z.string()
  .refine((val) => !isNaN(parseFloat(val)) && parseFloat(parseFloat(val).toFixed(2)) >= 0.00, {
    message: "The number must be greater than or equal to 0.00",
  })
  .transform((val) => parseFloat(val).toFixed(2))
  .optional(),
  carpanter_commision_type: z.enum(["percentage", "perPiece"]).optional(),
  architect_commision:  z.string()
  .refine((val) => !isNaN(parseFloat(val)) && parseFloat(parseFloat(val).toFixed(2)) >= 0.00, {
    message: "The number must be greater than or equal to 0.00",
  })
  .transform((val) => parseFloat(val).toFixed(2))
  .optional(),
  architect_commision_type: z.enum(["percentage", "perPiece"]).optional()
})

export const createOrderType = z.object({

  note: z.string().optional(),

  customer_id: z.string().uuid().optional(),
  carpanter_id: z.string().uuid().optional(),
  architect_id: z.string().uuid().optional(),
  driver_id: z.string().uuid().optional(),
  
  status: z.enum(["Pending", "Delivered"]),
  priority: z.enum(["High", "Medium", "Low"]),
  
  payment_status: z.enum(["UnPaid", "Partial", "Paid"]),

  delivery_date: z.string().optional(),
  delivery_address_id: z.string().uuid().optional(),

  labour_frate_cost: z.number().default(0),

  discount: z.string()
  .refine((val) => !isNaN(parseFloat(val)) && parseFloat(parseFloat(val).toFixed(2)) >= 0.00, {
    message: "The number must be greater than or equal to 0.00",
  })
  .transform((val) => parseFloat(val).toFixed(2))
  .optional(),

  amount_paid: z.string()
  .refine((val) => !isNaN(parseFloat(val)) && parseFloat(parseFloat(val).toFixed(2)) >= 0.00, {
    message: "The number must be greater than or equal to 0.00",
  })
  .transform((val) => parseFloat(val).toFixed(2))
  .optional(),

  order_items: z.array(orderItem).min(1, "At least one item is required"),
})
.strict("Too many fields in the body")

export const getAllOrdersType = z.object({
  cursor: z.date(),
  filter: z
    .enum([
      "Status-Pending",
      "Status-Delivered",
      "Priority-High",
      "Priority-Medium",
      "Priority-Low",
      "Payment-UnPaid",
      "Payment-Partial",
      "Payment-Paid",
    ])
    .optional(),
});

export const getOrderType = z.object({
  order_id: z.string().uuid()
});