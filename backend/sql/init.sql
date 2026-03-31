CREATE DATABASE IF NOT EXISTS hellforge_db
DEFAULT CHARACTER SET utf8
COLLATE utf8_hungarian_ci;

USE hellforge_db;

CREATE TABLE `user`(
    `userId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);
CREATE TABLE `player_inventory`(
    `playerId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `helmet` INT UNSIGNED NOT NULL DEFAULT 1,
    `armor` INT UNSIGNED NOT NULL DEFAULT 2,
    `melee` INT UNSIGNED NOT NULL DEFAULT 1,
    `ranged` INT UNSIGNED NOT NULL DEFAULT 2
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
    `stashId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
    `loadoutId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `playerId` INT UNSIGNED NOT NULL,
    `armor_id` INT UNSIGNED DEFAULT NULL,
    `weapon_id` INT UNSIGNED DEFAULT NULL,
    `misc_item_id` INT UNSIGNED DEFAULT NULL,
    `gold_amount` INT UNSIGNED DEFAULT NULL,
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
ALTER TABLE
    `player_inventory` ADD CONSTRAINT `player_inventory_armor_foreign` FOREIGN KEY(`armor`) REFERENCES `armors`(`armorId`);
ALTER TABLE
    `player_inventory` ADD CONSTRAINT `player_inventory_ranged_foreign` FOREIGN KEY(`ranged`) REFERENCES `weapons`(`weaponId`);
ALTER TABLE
    `player_inventory` ADD CONSTRAINT `player_inventory_helmet_foreign` FOREIGN KEY(`helmet`) REFERENCES `armors`(`armorId`);
ALTER TABLE
    `player_inventory` ADD CONSTRAINT `player_inventory_playerid_foreign` FOREIGN KEY(`playerId`) REFERENCES `user`(`userId`);
ALTER TABLE
    `player_inventory` ADD CONSTRAINT `player_inventory_melee_foreign` FOREIGN KEY(`melee`) REFERENCES `weapons`(`weaponId`);

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

INSERT INTO `user` (`name`, `password`) VALUES
    ('test_player_1',  '$2b$12$VF39VlT.u4aYpVfEkEIjReijHK5Vh.W/1fsv/2K/YWLsvaLk8qr1K'),
    ('test_player_2',  '$2b$12$5/kPX.UYOQDnL6n4TsBWV.29QBYX8MlE3507KsO5qtQs/yhjP2CDq'),
    ('test_player_3',  '$2b$12$YN/neNEDfcqMRnBmQLGAeeTq3O6mMdWMcxuulFb85FxWMg.CHQz9y'),
    ('test_player_4',  '$2b$12$fvYI7KXvMT6DNNk8l7uNT.2xlnwuKqGCN7arMQuARDL/fxRgp22/K'),
    ('test_player_5',  '$2b$12$6xvix2HOLcoUxTlicJCGOOgK7vMhY.7b1pLAFOLxwH6YPXMX/4PGS'),
    ('test_player_6',  '$2b$12$bzkiZPo0HXhtLCXv2B9qX.S2XBdhJD4EddD8Bm2CzGE/wXmvoBYUa'),
    ('test_player_7',  '$2b$12$.wv2IzxmcGGfSVV.ufkToeCwvZfueqffyPerYaxDQZPRPbIYzZKVe'),
    ('test_player_8',  '$2b$12$GoYlITs4oc38MMHKgNhEcOB1zTL8J4qj4f68tNT8NgTkndfClWWZi'),
    ('test_player_9',  '$2b$12$qKAihZFDuHJiq0SIFjI/Yu8Q1fotlcU4sLFRkVe7PhGqUGhkF.iwi'),
    ('test_player_10', '$2b$12$CdstJyjCSmG0S6S3jLmc5OtLImYjn1nLOzLTwe46cW2lplpFuEStq');
 

INSERT INTO `player_inventory` (`playerId`, `helmet`, `armor`, `melee`, `ranged`) VALUES
    (1, 1, 2, 1, 2),
    (2, 3, 4, 3, 4),
    (3, 5, 6, 5, 6),
    (4, 7, 8, 7, 8),
    (5, 9, 10, 9, 10),
    (6, 11, 12, 11, 12),
    (7, 1, 2, 3, 4),
    (8, 3, 4, 5, 6),
    (9, 5, 6, 7, 8),
    (10, 7, 8, 9, 10);

INSERT INTO `player_stash` (`playerId`, `gold`, `armor_id`, `weapon_id`, `misc_item_id`) VALUES
    (1, 100, NULL, NULL, NULL),
    (2, 250, NULL, NULL, NULL),
    (3, 500, NULL, NULL, NULL),
    (4, 800, NULL, NULL, NULL),
    (5, 1200, NULL, NULL, NULL),
    (6, 2000, NULL, NULL, NULL),
    (7, 150, NULL, NULL, NULL),
    (8, 300, NULL, NULL, NULL),
    (9, 650, NULL, NULL, NULL),
    (10, 950, NULL, NULL, NULL);


INSERT INTO `admin` (`name`, `password`) VALUES
    ('admin1', '$2b$12$bFTZ0gRntwWna8QuX1FiOub9S6O6wGI33N39brS8BHfm7sPDqVkeO'),
    ('admin2', '$2b$12$rQERE5lvalXcpcNIIYnh6eMHlNpZvuc2Xl5qz/O./oO9slbZOYkue');

