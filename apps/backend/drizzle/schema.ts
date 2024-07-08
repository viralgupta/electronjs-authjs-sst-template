import { relations } from "drizzle-orm";
import {
  uuid,
  text,
  pgTable,
  boolean,
  integer,
  numeric,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("user_id").defaultRandom().notNull(),
  name: text("user_name").notNull(),
  phone_number: text("user_phone_number").unique().notNull(),
  isAdmin: boolean("user_isAdmin").default(false).notNull(),
  otp: integer("user_otp"),
});

export const customer = pgTable("customer", {
  id: uuid("customer_id").defaultRandom().notNull(),
  name: text("customer_name").notNull(),
  priority: text("customer_priority", {
    enum: ["Low", "Mid", "High"],
  })
    .notNull()
    .default("Low"),
  balance: numeric("customer_balance", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  total_order_value: numeric("customer_total_order_value", {
    precision: 10,
    scale: 2,
  })
    .notNull()
    .default("0.00"),
});

export const customer_relation = relations(customer, ({ many }) => ({
  phone_numbers: many(phone_number),
  addresses: many(customer_address),
  orders: many(order),
  estimates: many(estimate),
}));

export const customer_address = pgTable("customer_address", {
  id: uuid("customer_address_id").defaultRandom().notNull(),
  customer_id: uuid("customer_id")
    .references(() => customer.id)
    .notNull(),
  address: text("customer_address").notNull(),
  city: text("customer_city").notNull(),
  state: text("customer_state").notNull(),
  pincode: text("customer_pincode").notNull(),
  isDefault: boolean("customer_address_isDefault").default(false).notNull(),
  latitue: numeric("customer_address_latitue", { precision: 10, scale: 7 }),
  longitude: numeric("customer_address_longitude", { precision: 10, scale: 7 }),
});

export const customer_address_relation = relations(
  customer_address,
  ({ one }) => ({
    customer: one(customer, {
      fields: [customer_address.customer_id],
      references: [customer.id],
    }),
  })
);

export const architect = pgTable("architect", {
  id: uuid("architect_id").defaultRandom().notNull(),
  name: text("architect_name").notNull(),
  profileUrl: text("architect_profileUrl"),
  area: text("architect_area").notNull(),
  balance: numeric("architect_balance", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
});

export const architect_relation = relations(architect, ({ many }) => ({
  phone_numbers: many(phone_number),
  orders: many(order),
}));

export const carpanter = pgTable("carpanter", {
  id: uuid("carpanter_id").defaultRandom().notNull(),
  name: text("carpanter_name").notNull(),
  profileUrl: text("carpanter_profileUrl"),
  area: text("carpanter_area").notNull(),
  balance: numeric("carpanter_balance", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
});

export const carpanter_relation = relations(carpanter, ({ many }) => ({
  phone_numbers: many(phone_number),
  orders: many(order),
}));

export const driver = pgTable("driver", {
  id: uuid("driver_id").defaultRandom().notNull(),
  name: text("driver_name").notNull(),
  profileUrl: text("driver_profileUrl"),
  vehicle_number: text("driver_vehicle_number"),
  size_of_vehicle: text("driver_size_of_vehicle", {
    enum: ["rickshaw", "tempo", "chota-hathi", "tata", "truck"],
  }).notNull(),
});

export const driver_relation = relations(driver, ({ many }) => ({
  phone_numbers: many(phone_number),
  orders: many(order),
}));

export const phone_number = pgTable("phone_number", {
  id: uuid("phone_number_id").defaultRandom().notNull(),
  customer_id: uuid("customer_id").references(() => customer.id),
  architect_id: uuid("architect_id").references(() => architect.id),
  carpanter_id: uuid("carpanter_id").references(() => carpanter.id),
  driver_id: uuid("driver_id").references(() => driver.id),
  country_code: text("phone_number_country_code").notNull(),
  phone_number: text("phone_number").notNull(),
  whatsappChatId: text("phone_number_whatsappChatId"),
  isPrimary: boolean("phone_number_isPrimary").default(false).notNull(),
});

export const phone_number_relation = relations(phone_number, ({ one }) => ({
  customer: one(customer, {
    fields: [phone_number.customer_id],
    references: [customer.id],
  }),
  architect: one(architect, {
    fields: [phone_number.architect_id],
    references: [architect.id],
  }),
  carpanter: one(carpanter, {
    fields: [phone_number.carpanter_id],
    references: [carpanter.id],
  }),
  driver: one(driver, {
    fields: [phone_number.driver_id],
    references: [driver.id],
  }),
}));

export const item = pgTable("item", {
  id: uuid("item_id").primaryKey().defaultRandom().notNull(),
  name: text("item_name").notNull(),
  multiplier: numeric("item_multiplier", { precision: 10, scale: 2 })
    .notNull()
    .default("1.00"),
  category: text("item_category", {
    enum: [
      "Adhesives",
      "Plywood",
      "Laminate",
      "Veneer",
      "Decorative",
      "Moulding",
      "Miscellaneous",
      "Door",
    ],
  }).notNull(),
  quantity: numeric("item_quantity", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  min_quantity: numeric("item_min_quantity", {
    precision: 10,
    scale: 2,
  }).default("0.00"),
  min_rate: numeric("item_min_rate", { precision: 10, scale: 2 }),
  sale_rate: numeric("item_min_rate", { precision: 10, scale: 2 }).notNull(),
  rate_dimension: text("item_rate_dimension", {
    enum: ["rft", "sq/ft", "piece"],
  }).notNull(),
});

export const item_relation = relations(item, ({ many }) => ({
  orders: many(order_item),
  estimates: many(estimate_item),
}));

export const order = pgTable("order", {
  id: uuid("order_id").primaryKey().defaultRandom().notNull(),

  note: text("order_note"),

  customer_id: uuid("customer_id").references(() => customer.id),
  carpanter_id: uuid("carpanter_id").references(() => carpanter.id),
  architect_id: uuid("architect_id").references(() => architect.id),
  driver_id: uuid("driver_id").references(() => driver.id),

  status: text("order_status", {
    enum: ["Pending", "Delivered"],
  })
    .notNull()
    .default("Pending"),
  priority: text("order_priority", {
    enum: ["High", "Medium", "Low"],
  })
    .notNull()
    .default("Low"),
  payment_status: text("order_payment_status", {
    enum: ["UnPaid", "Partial", "Paid"],
  })
    .notNull()
    .default("UnPaid"),

  delivery_date: date("order_delivery_date"),
  delivery_address: uuid("order_address_id").references(
    () => customer_address.id
  ),

  labour_frate_cost: integer("order_labour_frate_cost").notNull(),
  total_order_amount: numeric("total_order_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  discount: numeric("order_discount", { precision: 10, scale: 2 }).notNull(),
  amount_paid: numeric("amount_paid", { precision: 10, scale: 2 }).notNull(),

  carpanter_commision: numeric("order_carpanter_commision", {
    precision: 10,
    scale: 2,
  }),
  architect_commision: numeric("order_architect_commision", {
    precision: 10,
    scale: 2,
  }),

  created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const order_relation = relations(order, ({ one, many }) => ({
  customer: one(customer, {
    fields: [order.customer_id],
    references: [customer.id],
  }),
  carpanter: one(carpanter, {
    fields: [order.carpanter_id],
    references: [carpanter.id],
  }),
  architect: one(architect, {
    fields: [order.architect_id],
    references: [architect.id],
  }),
  driver: one(driver, {
    fields: [order.driver_id],
    references: [driver.id],
  }),
  order_address: one(customer_address, {
    fields: [order.delivery_address],
    references: [customer_address.id],
  }),
  order_items: many(order_item),
}));

export const order_item = pgTable("order_item", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  order_id: uuid("order_item_order_id")
    .references(() => order.id)
    .notNull(),
  item_id: uuid("order_item_item_id")
    .references(() => item.id)
    .notNull(),
  quantity: numeric("order_item_quantity", { precision: 10, scale: 2 }).notNull(),
  rate: numeric("order_item_rate", { precision: 10, scale: 2 }).notNull(),
  total_value: numeric("order_item_total_value", {
    precision: 10,
    scale: 2,
  }).notNull(),
  carpanter_commision: numeric("order_item_carpanter_commision", {
    precision: 10,
    scale: 2,
  }),
  carpanter_commision_type: text("order_item_carpanter_commision_type", {
    enum: ["percentage", "perPiece"],
  }),
  architect_commision: numeric("order_item_architect_commision", {
    precision: 10,
    scale: 2,
  }),
  architect_commision_type: text("order_item_architect_commision_type", {
    enum: ["percentage", "perPiece"],
  }),
});

export const order_item_relation = relations(order_item, ({ one }) => ({
  order: one(order, {
    fields: [order_item.order_id],
    references: [order.id],
  }),
  item: one(item, {
    fields: [order_item.item_id],
    references: [item.id],
  }),
}));

export const estimate = pgTable("estimate", {
  id: uuid("estimate_id").primaryKey().defaultRandom().notNull(),
  customer_id: uuid("customer_id").references(() => customer.id),
  total_estimate_amount: numeric("total_estimate_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const estimate_relation = relations(estimate, ({ one, many }) => ({
  customer: one(customer, {
    fields: [estimate.customer_id],
    references: [customer.id],
  }),
  estimate_items: many(estimate_item),
}));

export const estimate_item = pgTable("estimate_item", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  estimate_id: uuid("estimate_item_estimate_id")
    .references(() => estimate.id)
    .notNull(),
  item_id: uuid("estimate_item_item_id")
    .references(() => item.id)
    .notNull(),
  quantity: numeric("estimate_item_quantity", { precision: 10, scale: 2 }).notNull(),
  rate: numeric("estimate_item_rate", { precision: 10, scale: 2 }).notNull(),
  total_value: numeric("estimate_item_total_value", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const estimate_item_relation = relations(estimate_item, ({ one }) => ({
  estimate: one(estimate, {
    fields: [estimate_item.estimate_id],
    references: [estimate.id],
  }),
  item: one(item, {
    fields: [estimate_item.item_id],
    references: [item.id],
  }),
}));
