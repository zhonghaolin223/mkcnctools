ALTER TABLE `inquiries` ADD `country` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `quantity` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `product_name` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `traffic_source` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `utm_source` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `utm_medium` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `utm_campaign` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `notes` text DEFAULT '' NOT NULL;
--> statement-breakpoint
CREATE INDEX `idx_inquiries_product_created` ON `inquiries` (`product_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `submission_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`window_started_at` integer NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_submission_limits_window` ON `submission_limits` (`window_started_at`);
