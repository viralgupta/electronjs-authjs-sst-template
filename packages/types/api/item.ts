import { z } from "zod";

export const createItemType = z
  .object({
    name: z.string().max(256, "Item name is too long"),
    multiplier: z
      .number()
      .positive("Multiplier Needs to be greater than 0")
      .default(1),
    category: z.enum([
      "Adhesives",
      "Plywood",
      "Laminate",
      "Veneer",
      "Decorative",
      "Moulding",
      "Miscellaneous",
      "Door",
    ]),
    quantity: z
      .number()
      .positive("Quantity needs to be greater than equal to 0")
      .default(0),
    min_quantity: z
      .number()
      .positive("Min Quantity needs to be greater than equal to 0")
      .default(0),
    min_rate: z
      .number()
      .positive("Min Rate needs to be greater than equal to 0")
      .default(0)
      .optional(),
    sale_rate: z
      .number()
      .positive("Sale Rate needs to be greater than equal to 0")
      .default(0),
    rate_dimension: z.enum(["Rft", "sq/ft", "piece"]),
  })
  .strict("Too many fields in request body");

export const getItemType = z.object({
  item_id: z.string().uuid("Invalid Item ID"),
})

export const editItemType = createItemType.extend({
  item_id: z.string().uuid("Invalid Item ID"),
}).omit({
  quantity: true
}).strict("Too many fields in request body");

export const editItemQuantityType = z.object({
  item_id: z.string().uuid("Invalid Item ID"),
  quantity: z.number().positive("Quantity needs to be greater than equal to 0").default(0),
}).strict("Too many fields in request body");

export const deleteItemType = z.object({
  item_id: z.string().uuid("Invalid Item ID"),
})