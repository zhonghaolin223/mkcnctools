CREATE TABLE `product_media` (
	`product_id` integer NOT NULL,
	`media_id` integer NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_product_media_pair` ON `product_media` (`product_id`,`media_id`);--> statement-breakpoint
CREATE INDEX `idx_product_media_product_sort` ON `product_media` (`product_id`,`sort_order`);