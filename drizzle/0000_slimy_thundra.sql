CREATE TABLE `travel_request_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestCode` varchar(24) NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`storageUrl` varchar(512) NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`mimeType` varchar(160) NOT NULL,
	`sizeBytes` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `travel_request_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `travel_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestCode` varchar(24) NOT NULL,
	`service` varchar(128) NOT NULL,
	`project` varchar(255) NOT NULL,
	`requesterName` varchar(160) NOT NULL,
	`phone` varchar(48) NOT NULL,
	`email` varchar(320) NOT NULL,
	`details` text,
	`status` enum('new','in_review','complete') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `travel_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `travel_requests_requestCode_unique` UNIQUE(`requestCode`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `travel_request_attachments_request_idx` ON `travel_request_attachments` (`requestCode`);--> statement-breakpoint
CREATE INDEX `travel_requests_code_idx` ON `travel_requests` (`requestCode`);