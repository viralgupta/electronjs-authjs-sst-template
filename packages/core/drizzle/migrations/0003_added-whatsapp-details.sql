ALTER TABLE "architect" ADD COLUMN "architect_profileUrl" text;--> statement-breakpoint
ALTER TABLE "carpanter" ADD COLUMN "carpanter_profileUrl" text;--> statement-breakpoint
ALTER TABLE "driver" ADD COLUMN "driver_profileUrl" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "order_note" text;--> statement-breakpoint
ALTER TABLE "phone_number" ADD COLUMN "phone_number_whatsappChatId" text;--> statement-breakpoint
ALTER TABLE "driver" DROP COLUMN IF EXISTS "driver_balance";