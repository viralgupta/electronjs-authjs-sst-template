CREATE TABLE IF NOT EXISTS "architect" (
	"architect_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"architect_name" text NOT NULL,
	"architect_area" text NOT NULL,
	"architect_balance" numeric(10, 2) DEFAULT '0.00' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carpanter" (
	"carpanter_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"carpanter_name" text NOT NULL,
	"carpanter_area" text NOT NULL,
	"carpanter_balance" numeric(10, 2) DEFAULT '0.00' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer" (
	"customer_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"customer_name" text NOT NULL,
	"customer_priority" text DEFAULT 'Low' NOT NULL,
	"customer_balance" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"customer_total_order_value" numeric(10, 2) DEFAULT '0.00' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_address" (
	"customer_address_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"customer_address" text NOT NULL,
	"customer_city" text NOT NULL,
	"customer_state" text NOT NULL,
	"customer_pincode" text NOT NULL,
	"customer_address_isDefault" boolean DEFAULT false NOT NULL,
	"customer_address_latitue" numeric(10, 7),
	"customer_address_longitude" numeric(10, 7)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver" (
	"driver_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"driver_name" text NOT NULL,
	"driver_vehicle_number" text,
	"driver_size_of_vehicle" text NOT NULL,
	"driver_balance" numeric(10, 2) DEFAULT '0.00' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "estimate" (
	"estimate_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"total_estimate_amount" numeric(10, 2) NOT NULL,
	"created_at" text DEFAULT 'now()' NOT NULL,
	"updated_at" text DEFAULT 'now()' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "estimate_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"estimate_item_order_id" uuid NOT NULL,
	"estimate_item_item_id" uuid NOT NULL,
	"order_item_quantity" integer NOT NULL,
	"order_item_rate" numeric(10, 2) NOT NULL,
	"order_item_total_value" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_name" text NOT NULL,
	"item_multiplier" integer DEFAULT 1 NOT NULL,
	"item_category" text NOT NULL,
	"item_quantity" integer DEFAULT 0 NOT NULL,
	"item_min_quantity" integer DEFAULT 0,
	"item_min_rate" numeric(10, 2) NOT NULL,
	"item_rate_dimension" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"order_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"carpanter_id" uuid,
	"architect_id" uuid,
	"driver_id" uuid,
	"order_status" text DEFAULT 'Pending' NOT NULL,
	"order_priority" text DEFAULT 'Low' NOT NULL,
	"order_payment_status" text DEFAULT 'UnPaid' NOT NULL,
	"order_delivery_date" date,
	"order_address_id" uuid,
	"order_labour_frate_cost" integer NOT NULL,
	"total_order_amount" numeric(10, 2) NOT NULL,
	"order_discount" numeric(10, 2) NOT NULL,
	"amount_paid" numeric(10, 2) NOT NULL,
	"order_carpanter_commision" numeric(10, 2),
	"order_architect_commision" numeric(10, 2),
	"created_at" text DEFAULT 'now()' NOT NULL,
	"updated_at" text DEFAULT 'now()' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_item_order_id" uuid NOT NULL,
	"order_item_item_id" uuid NOT NULL,
	"order_item_quantity" integer NOT NULL,
	"order_item_rate" numeric(10, 2) NOT NULL,
	"order_item_total_value" numeric(10, 2) NOT NULL,
	"order_item_carpanter_commision" numeric(10, 2),
	"order_item_architect_commision" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phone_number" (
	"phone_number_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"architect_id" uuid,
	"carpanter_id" uuid,
	"driver_id" uuid,
	"phone_number" text NOT NULL,
	"phone_number_isPrimary" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"user_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_name" text NOT NULL,
	"user_phone_number" text NOT NULL,
	"user_isAdmin" boolean DEFAULT false NOT NULL,
	"user_otp" integer,
	CONSTRAINT "user_user_phone_number_unique" UNIQUE("user_phone_number")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "estimate" ADD CONSTRAINT "estimate_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "estimate_item" ADD CONSTRAINT "estimate_item_estimate_item_order_id_estimate_estimate_id_fk" FOREIGN KEY ("estimate_item_order_id") REFERENCES "public"."estimate"("estimate_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "estimate_item" ADD CONSTRAINT "estimate_item_estimate_item_item_id_item_item_id_fk" FOREIGN KEY ("estimate_item_item_id") REFERENCES "public"."item"("item_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_carpanter_id_carpanter_carpanter_id_fk" FOREIGN KEY ("carpanter_id") REFERENCES "public"."carpanter"("carpanter_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_architect_id_architect_architect_id_fk" FOREIGN KEY ("architect_id") REFERENCES "public"."architect"("architect_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_driver_id_driver_driver_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver"("driver_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_order_address_id_customer_address_customer_address_id_fk" FOREIGN KEY ("order_address_id") REFERENCES "public"."customer_address"("customer_address_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_item_order_id_order_order_id_fk" FOREIGN KEY ("order_item_order_id") REFERENCES "public"."order"("order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_item_item_id_item_item_id_fk" FOREIGN KEY ("order_item_item_id") REFERENCES "public"."item"("item_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phone_number" ADD CONSTRAINT "phone_number_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phone_number" ADD CONSTRAINT "phone_number_architect_id_architect_architect_id_fk" FOREIGN KEY ("architect_id") REFERENCES "public"."architect"("architect_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phone_number" ADD CONSTRAINT "phone_number_carpanter_id_carpanter_carpanter_id_fk" FOREIGN KEY ("carpanter_id") REFERENCES "public"."carpanter"("carpanter_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phone_number" ADD CONSTRAINT "phone_number_driver_id_driver_driver_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver"("driver_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
