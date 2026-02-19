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
    `gold` INT NOT NULL,
    `helmet` INT UNSIGNED NOT NULL DEFAULT 0,
    `armor` INT UNSIGNED NOT NULL DEFAULT 0,
    `melee` INT UNSIGNED NOT NULL DEFAULT 0,
    `ranged` INT UNSIGNED NOT NULL DEFAULT 0
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
    ('test_player_1', 'password1'),
    ('test_player_2', 'password2'),
    ('test_player_3', 'password3'),
    ('test_player_4', 'password4'),
    ('test_player_5', 'password5'),
    ('test_player_6', 'password6'),
    ('test_player_7', 'password7'),
    ('test_player_8', 'password8'),
    ('test_player_9', 'password9'),
    ('test_player_10', 'password10'),
    ('test_player_11', 'password11'),
    ('test_player_12', 'password12'),
    ('test_player_13', 'password13');

INSERT INTO `player_inventory` (`playerId`, `gold`, `helmet`, `armor`, `melee`, `ranged`) VALUES
    (1, 100, 1, 2, 1, 2),
    (2, 250, 3, 4, 3, 4),
    (3, 500, 5, 6, 5, 6),
    (4, 800, 7, 8, 7, 8),
    (5, 1200, 9, 10, 9, 10),
    (6, 2000, 11, 12, 11, 12),
    (7, 150, 1, 2, 3, 4),
    (8, 300, 3, 4, 5, 6),
    (9, 650, 5, 6, 7, 8),
    (10, 950, 7, 8, 9, 10),
    (11, 777, 7, 8, 9, 10),
    (12, 555, 9, 4, 1, 5),
    (13, 333, 5, 8, 6, 1);

INSERT INTO `admin` (`name`, `password`) VALUES ('admin1', 'adminpass1'), ('admin2', 'adminpass2');