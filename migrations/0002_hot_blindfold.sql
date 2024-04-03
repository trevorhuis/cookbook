CREATE TABLE `menu_recipe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`menu_id` integer NOT NULL,
	`recipe_id` integer NOT NULL,
	FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `menu` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `menu_recipe_menu_id_recipe_id_unique` ON `menu_recipe` (`menu_id`,`recipe_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `menu_title_unique` ON `menu` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `menu_slug_unique` ON `menu` (`slug`);