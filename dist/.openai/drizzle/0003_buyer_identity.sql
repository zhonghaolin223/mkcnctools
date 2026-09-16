ALTER TABLE `inquiries` ADD `job_title` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `company_website` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `buyer_type` text DEFAULT '' NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `preferred_contact` text DEFAULT 'email' NOT NULL;
--> statement-breakpoint
ALTER TABLE `inquiries` ADD `privacy_consent_at` text DEFAULT '' NOT NULL;
