CREATE DATABASE IF NOT EXISTS hellforge_db
DEFAULT CHARACTER SET utf8
COLLATE utf8_hungarian_ci;

USE hellforge_db;

CREATE TABLE `user`(
    `userId` INT UNSIGNED NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `armors`(
    `armorId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `img_path` VARCHAR(255) NOT NULL,
    `tier` INT NOT NULL,
    `price` INT NOT NULL,
    `defense_multiplier` DOUBLE NOT NULL
);
CREATE TABLE `weapons`(
    `weaponId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `img_path` VARCHAR(255) NOT NULL,
    `tier` INT NOT NULL,
    `price` INT NOT NULL,
    `attack_multiplier` DOUBLE NOT NULL
);

CREATE TABLE `misc_items`(
    `itemId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `img_path` VARCHAR(255) NOT NULL,
    `value` INT NOT NULL
);

CREATE TABLE `player_stash`(
    `stashId` INT UNSIGNED NOT NULL PRIMARY KEY,
    `gold` INT NOT NULL DEFAULT 0,
    `playerId` INT UNSIGNED NOT NULL,
    `armor_id` INT UNSIGNED DEFAULT NULL,
    `weapon_id` INT UNSIGNED DEFAULT NULL,
    `misc_item_id` INT UNSIGNED DEFAULT NULL,
    CONSTRAINT `stash_player_foreign` FOREIGN KEY(`playerId`) REFERENCES `user`(`userId`),
    CONSTRAINT `stash_armor_foreign` FOREIGN KEY(`armor_id`) REFERENCES `armors`(`armorId`),
    CONSTRAINT `stash_weapon_foreign` FOREIGN KEY(`weapon_id`) REFERENCES `weapons`(`weaponId`),
    CONSTRAINT `stash_misc_item_foreign` FOREIGN KEY(`misc_item_id`) REFERENCES `misc_items`(`itemId`)
);

CREATE TABLE `player_loadout`(
    `loadoutId` INT UNSIGNED NOT NULL PRIMARY KEY,
    `playerId` INT UNSIGNED NOT NULL,
    `armor_id` INT UNSIGNED DEFAULT NULL,
    `weapon_id` INT UNSIGNED DEFAULT NULL,
    `misc_item_id` INT UNSIGNED DEFAULT NULL,
    `gold_amount` INT UNSIGNED DEFAULT NULL,
    `equipped` TINYINT(1) NOT NULL DEFAULT 0,
    `slot` VARCHAR(20) DEFAULT NULL,
    CONSTRAINT `loadout_player_foreign` FOREIGN KEY(`playerId`) REFERENCES `user`(`userId`),
    CONSTRAINT `loadout_armor_foreign` FOREIGN KEY(`armor_id`) REFERENCES `armors`(`armorId`),
    CONSTRAINT `loadout_weapon_foreign` FOREIGN KEY(`weapon_id`) REFERENCES `weapons`(`weaponId`),
    CONSTRAINT `loadout_misc_item_foreign` FOREIGN KEY(`misc_item_id`) REFERENCES `misc_items`(`itemId`)
);

CREATE TABLE `admin`(
    `adminId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `item_instances`(
    `instanceId` INT UNSIGNED NOT NULL PRIMARY KEY,
    `item_type` ENUM('armor', 'weapon', 'misc') NOT NULL,
    `item_ref_id` INT UNSIGNED NOT NULL
);

CREATE TABLE `item_instance_cards`(
    `id` INT UNSIGNED NOT NULL PRIMARY KEY,
    `instance_id` INT UNSIGNED NOT NULL,
    `card_id` INT NOT NULL,
    `slot` INT NOT NULL,
    CONSTRAINT `iic_instance_foreign` FOREIGN KEY(`instance_id`) REFERENCES `item_instances`(`instanceId`) ON DELETE CASCADE
);

ALTER TABLE `player_stash` ADD COLUMN `instance_id` INT UNSIGNED DEFAULT NULL;
ALTER TABLE `player_stash` ADD CONSTRAINT `stash_instance_foreign` FOREIGN KEY(`instance_id`) REFERENCES `item_instances`(`instanceId`);

ALTER TABLE `player_loadout` ADD COLUMN `instance_id` INT UNSIGNED DEFAULT NULL;
ALTER TABLE `player_loadout` ADD CONSTRAINT `loadout_instance_foreign` FOREIGN KEY(`instance_id`) REFERENCES `item_instances`(`instanceId`);

INSERT INTO `armors` (`type`, `name`, `img_path`, `tier`, `price`, `defense_multiplier`) VALUES
    ('Helmet', 'Rusty Helmet', '../textures/items/armour/helmet_rusty.png', 1, 5, 1),
    ('Armor', 'Rusty Chestplate', '../textures/items/armour/armour_rusty.png', 1, 10, 1),
    ('Helmet', 'Worn Helmet', '../textures/items/armour/helmet_worn.png', 2, 20, 1.1),
    ('Armor', 'Worn Chestplate', '../textures/items/armour/armour_worn.png', 2, 50, 1.2),
    ('Helmet', 'Regular Helmet', '../textures/items/armour/helmet_regular.png', 3, 60, 1.35),
    ('Armor', 'Regular Chestplate', '../textures/items/armour/armour_regular.png', 3, 120, 1.55),
    ('Helmet', 'Mythical Helmet', '../textures/items/armour/helmet_mythical.png', 4, 150, 1.65),
    ('Armor', 'Mythical Chestplate', '../textures/items/armour/armour_mythical.png', 4, 300, 1.95),
    ('Helmet', 'Legendary Helmet', '../textures/items/armour/helmet_legendary.png', 5, 350, 2.1),
    ('Armor', 'Legendary Chestplate', '../textures/items/armour/armour_legendary.png', 5, 700, 2.5),
    ('Helmet', 'Hellish Helmet', '../textures/items/armour/helmet_hellish.png', 6, 800, 2.8),
    ('Armor', 'Hellish Chestplate', '../textures/items/armour/armour_hellish.png', 6, 1600, 3.4);

INSERT INTO `weapons` (`type`, `name`, `img_path`, `tier`, `price`, `attack_multiplier`) VALUES
    ('Melee', 'Rusty Sword', '../textures/items/weapons/sword_rusty.png', 1, 15, 1),
    ('Ranged', 'Rusty Bow', '../textures/items/weapons/bow_rusty.png', 1, 10, 1),
    ('Melee', 'Worn Sword', '../textures/items/weapons/sword_worn.png', 2, 60, 1.25),
    ('Ranged', 'Worn Bow', '../textures/items/weapons/bow_worn.png', 2, 50, 1.15),
    ('Melee', 'Regular Sword', '../textures/items/weapons/sword_regular.png', 3, 150, 1.65),
    ('Ranged', 'Regular Bow', '../textures/items/weapons/bow_regular.png', 3, 120, 1.55),
    ('Melee', 'Mythical Sword', '../textures/items/weapons/sword_mythical.png', 4, 380, 2.2),
    ('Ranged', 'Mythical Bow', '../textures/items/weapons/bow_mythical.png', 4, 300, 2.0),
    ('Melee', 'Legendary Sword', '../textures/items/weapons/sword_legendary.png', 5, 900, 2.8),
    ('Ranged', 'Legendary Bow', '../textures/items/weapons/bow_legendary.png', 5, 700, 2.6),
    ('Melee', 'Hellish Sword', '../textures/items/weapons/sword_hellish.png', 6, 2100, 3.6),
    ('Ranged', 'Hellish Bow', '../textures/items/weapons/bow_hellish.png', 6, 1600, 3.2);

INSERT INTO `user` (`userId`, `name`, `password`) VALUES
(1, 'test_player_1', '$2b$12$VF39VlT.u4aYpVfEkEIjReijHK5Vh.W/1fsv/2K/YWLsvaLk8qr1K'),
    (2, 'test_player_2', '$2b$12$5/kPX.UYOQDnL6n4TsBWV.29QBYX8MlE3507KsO5qtQs/yhjP2CDq'),
    (3, 'test_player_3', '$2b$12$YN/neNEDfcqMRnBmQLGAeeTq3O6mMdWMcxuulFb85FxWMg.CHQz9y');

INSERT INTO `item_instances` (`instanceId`, `item_type`, `item_ref_id`) VALUES
    (1,'armor',1),(2,'armor',2),(3,'weapon',1),(4,'weapon',2),
    (5,'armor',1),(6,'armor',2),(7,'weapon',1),(8,'weapon',2),
    (9,'armor',1),(10,'armor',2),(11,'weapon',1),(12,'weapon',2);

-- Starter cards: Helmet→121-125, Armor→181-185, Melee→1-5, Ranged→61-65
INSERT INTO `item_instance_cards` (`id`, `instance_id`, `card_id`, `slot`) VALUES
    (1,1,121,1),(2,1,122,2),(3,1,123,3),(4,1,124,4),(5,1,125,5),
    (6,2,181,1),(7,2,182,2),(8,2,183,3),(9,2,184,4),(10,2,185,5),
    (11,3,1,1),(12,3,2,2),(13,3,3,3),(14,3,4,4),(15,3,5,5),
    (16,4,61,1),(17,4,62,2),(18,4,63,3),(19,4,64,4),(20,4,65,5),
    (21,5,121,1),(22,5,122,2),(23,5,123,3),(24,5,124,4),(25,5,125,5),
    (26,6,181,1),(27,6,182,2),(28,6,183,3),(29,6,184,4),(30,6,185,5),
    (31,7,1,1),(32,7,2,2),(33,7,3,3),(34,7,4,4),(35,7,5,5),
    (36,8,61,1),(37,8,62,2),(38,8,63,3),(39,8,64,4),(40,8,65,5),
    (41,9,121,1),(42,9,122,2),(43,9,123,3),(44,9,124,4),(45,9,125,5),
    (46,10,181,1),(47,10,182,2),(48,10,183,3),(49,10,184,4),(50,10,185,5),
    (51,11,1,1),(52,11,2,2),(53,11,3,3),(54,11,4,4),(55,11,5,5),
    (56,12,61,1),(57,12,62,2),(58,12,63,3),(59,12,64,4),(60,12,65,5);

INSERT INTO `player_loadout` (`loadoutId`, `playerId`, `armor_id`, `weapon_id`, `equipped`, `slot`, `instance_id`) VALUES
    (1, 1, 1, NULL, 1, 'helmet', 1),
    (2, 1, 2, NULL, 1, 'armor', 2),
    (3, 1, NULL, 1, 1, 'melee', 3),
    (4, 1, NULL, 2, 1, 'ranged', 4),
    (5, 2, 1, NULL, 1, 'helmet', 5),
    (6, 2, 2, NULL, 1, 'armor', 6),
    (7, 2, NULL, 1, 1, 'melee', 7),
    (8, 2, NULL, 2, 1, 'ranged', 8),
    (9, 3, 1, NULL, 1, 'helmet', 9),
    (10, 3, 2, NULL, 1, 'armor', 10),
    (11, 3, NULL, 1, 1, 'melee', 11),
    (12, 3, NULL, 2, 1, 'ranged', 12);

INSERT INTO `player_stash` (`stashId`, `playerId`, `gold`, `armor_id`, `weapon_id`, `misc_item_id`) VALUES
    (1, 1, 100, NULL, NULL, NULL),
    (2, 2, 250, NULL, NULL, NULL),
    (3, 3, 500, NULL, NULL, NULL);

INSERT INTO admin (name, password) VALUES
    ('admin1', '$2b$12$bFTZ0gRntwWna8QuX1FiOub9S6O6wGI33N39brS8BHfm7sPDqVkeO'),
    ('admin2', '$2b$12$rQERE5lvalXcpcNIIYnh6eMHlNpZvuc2Xl5qz/O./oO9slbZOYkue');
