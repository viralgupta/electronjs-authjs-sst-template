ALTER TABLE "estimate_item" RENAME COLUMN "estimate_item_order_id" TO "estimate_item_estimate_id";--> statement-breakpoint
ALTER TABLE "estimate_item" RENAME COLUMN "order_item_quantity" TO "estimate_item_quantity";--> statement-breakpoint
ALTER TABLE "estimate_item" RENAME COLUMN "order_item_rate" TO "estimate_item_rate";--> statement-breakpoint
ALTER TABLE "estimate_item" RENAME COLUMN "order_item_total_value" TO "estimate_item_total_value";--> statement-breakpoint
ALTER TABLE "estimate_item" DROP CONSTRAINT "estimate_item_estimate_item_order_id_estimate_estimate_id_fk";
--> statement-breakpoint
ALTER TABLE "estimate" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "estimate" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "estimate" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "estimate" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "estimate_item" ALTER COLUMN "estimate_item_quantity" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "item_multiplier" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "item_multiplier" SET DEFAULT '1.00';--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "item_quantity" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "item_quantity" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "item_min_quantity" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "item_min_quantity" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "order_item" ALTER COLUMN "order_item_quantity" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "estimate_item" ADD CONSTRAINT "estimate_item_estimate_item_estimate_id_estimate_estimate_id_fk" FOREIGN KEY ("estimate_item_estimate_id") REFERENCES "public"."estimate"("estimate_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
