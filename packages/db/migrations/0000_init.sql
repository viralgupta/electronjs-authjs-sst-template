CREATE TABLE IF NOT EXISTS "architect" (
	"architect_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"architect_name" varchar(30) NOT NULL,
	"architect_profileUrl" text,
	"architect_area" varchar(20) NOT NULL,
	"architect_balance" numeric(10, 2) DEFAULT '0.00'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carpanter" (
	"carpanter_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"carpanter_name" varchar(30) NOT NULL,
	"carpanter_profileUrl" text,
	"carpanter_area" varchar(20) NOT NULL,
	"carpanter_balance" numeric(10, 2) DEFAULT '0.00'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer" (
	"customer_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_name" varchar(50) NOT NULL,
	"customer_profileUrl" text,
	"customer_priority" varchar DEFAULT 'Low',
	"customer_balance" numeric(10, 2) DEFAULT '0.00',
	"customer_total_order_value" numeric(10, 2) DEFAULT '0.00'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_address" (
	"customer_address_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"customer_address" varchar(256) NOT NULL,
	"customer_city" varchar(30) NOT NULL,
	"customer_state" varchar(20) NOT NULL,
	"customer_pincode" varchar(8) NOT NULL,
	"customer_address_isDefault" boolean DEFAULT false,
	"customer_address_latitue" numeric(10, 7),
	"customer_address_longitude" numeric(10, 7)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver" (
	"driver_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"driver_name" varchar(30) NOT NULL,
	"driver_profileUrl" text,
	"driver_vehicle_number" varchar(12),
	"driver_size_of_vehicle" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "estimate" (
	"estimate_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"total_estimate_amount" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "estimate_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"estimate_item_estimate_id" uuid NOT NULL,
	"estimate_item_item_id" uuid NOT NULL,
	"estimate_item_quantity" real NOT NULL,
	"estimate_item_rate" real NOT NULL,
	"estimate_item_total_value" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_name" varchar(256) NOT NULL,
	"item_multiplier" real DEFAULT 1 NOT NULL,
	"item_category" varchar NOT NULL,
	"item_quantity" real NOT NULL,
	"item_min_quantity" numeric(10, 2) NOT NULL,
	"item_min_rate" real NOT NULL,
	"item_rate_dimension" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"order_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_note" text,
	"customer_id" uuid,
	"carpanter_id" uuid,
	"architect_id" uuid,
	"driver_id" uuid,
	"order_status" varchar DEFAULT 'Pending' NOT NULL,
	"order_priority" varchar DEFAULT 'Low' NOT NULL,
	"order_payment_status" varchar DEFAULT 'UnPaid' NOT NULL,
	"order_delivery_date" date,
	"order_address_id" uuid,
	"order_labour_frate_cost" real NOT NULL,
	"total_order_amount" numeric(10, 2) NOT NULL,
	"order_discount" numeric(10, 2) DEFAULT '0.00',
	"amount_paid" numeric(10, 2) DEFAULT '0.00',
	"order_carpanter_commision" numeric(10, 2),
	"order_architect_commision" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_item_order_id" uuid NOT NULL,
	"order_item_item_id" uuid NOT NULL,
	"order_item_quantity" real NOT NULL,
	"order_item_rate" real NOT NULL,
	"order_item_total_value" numeric(10, 2) NOT NULL,
	"order_item_carpanter_commision" numeric(10, 2),
	"order_item_carpanter_commision_type" varchar,
	"order_item_architect_commision" numeric(10, 2),
	"order_item_architect_commision_type" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phone_number" (
	"phone_number_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"architect_id" uuid,
	"carpanter_id" uuid,
	"driver_id" uuid,
	"phone_number_country_code" varchar(5),
	"phone_number" varchar(10) NOT NULL,
	"phone_number_whatsappChatId" varchar(20),
	"phone_number_isPrimary" boolean DEFAULT false,
	CONSTRAINT "phone_number_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "phone_number_phone_number_whatsappChatId_unique" UNIQUE("phone_number_whatsappChatId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_name" varchar(30) NOT NULL,
	"user_phone_number" varchar(10) NOT NULL,
	"user_isAdmin" boolean DEFAULT false,
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
 ALTER TABLE "estimate_item" ADD CONSTRAINT "estimate_item_estimate_item_estimate_id_estimate_estimate_id_fk" FOREIGN KEY ("estimate_item_estimate_id") REFERENCES "public"."estimate"("estimate_id") ON DELETE no action ON UPDATE no action;
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
