-- Création du schéma
CREATE SCHEMA IF NOT EXISTS `ts_wild_wall`;

-- Création de la table "role"
CREATE TABLE IF NOT EXISTS `ts_wild_wall`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(45) NOT NULL,
  `role_code` VARCHAR(45) NOT NULL
);

-- Création de la table "statut"
CREATE TABLE IF NOT EXISTS `ts_wild_wall`.`statut` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `statut_name` VARCHAR(45) NOT NULL
);

-- Création de la table "user" avec une clé étrangère "role_id" et une contrainte d'unicité sur le champ "username"
CREATE TABLE IF NOT EXISTS `ts_wild_wall`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(45) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role_id` INT NOT NULL,
  FOREIGN KEY (`role_id`) REFERENCES `ts_wild_wall`.`role`(`id`)
);

-- Création de la table "color"
CREATE TABLE IF NOT EXISTS `ts_wild_wall`.`color` (
  `id` INT NOT NULL PRIMARY KEY,
  `color_name` VARCHAR(45) NOT NULL,
  `color_code` VARCHAR(45) NOT NULL
);

-- Création de la table "post" avec des clés étrangères "statut_id", "user_id" et "color_id"
CREATE TABLE IF NOT EXISTS `ts_wild_wall`.`post` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `post_text` VARCHAR(255) NOT NULL,
  `post_date` DATETIME NOT NULL,
  `statut_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `color_id` INT NOT NULL,
  FOREIGN KEY (`statut_id`) REFERENCES `ts_wild_wall`.`statut`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `ts_wild_wall`.`user`(`id`),
  FOREIGN KEY (`color_id`) REFERENCES `ts_wild_wall`.`color`(`id`)
);

-- Insertion de données dans la table "role"
INSERT IGNORE INTO `ts_wild_wall`.`role` (`id`, `role_name`, `role_code`)
VALUES ('1', 'admin', '2013'),
       ('2', 'delegate', '4004'),
       ('3', 'wilder', '5067');

-- Insertion de données dans la table "statut"
INSERT IGNORE INTO `ts_wild_wall`.`statut` (`id`, `statut_name`)
VALUES ('1', 'main_wall'),
       ('2', 'archived');

-- Insertion de données dans la table "color"
INSERT IGNORE INTO `ts_wild_wall`.`color` (`id`, `color_name`, `color_code`)
VALUES ('1', 'green', '#c7ebb3'),
       ('2', 'pink', '#ffd5f8'),
       ('3', 'blue', '#c5e8f1'),
       ('4', 'yellow', '#f8eaae');

-- Insertion de l'utilisateur "Romain" avec le mot de passe "Romain" et le rôle "admin"
INSERT INTO `ts_wild_wall`.`user` (`username`, `password`, `role_id`)
VALUES ('Romain', '$2b$10$tz2Kn/x6zFIxy77Aq6bQQedNcbGoJNoJO1g4RGfTiOeAfflYCwTuO', 1);

-- Insertion du post "Premier post" avec la couleur bleue à la date du jour
INSERT INTO `ts_wild_wall`.`post` (`post_text`, `post_date`, `statut_id`, `user_id`, `color_id`)
VALUES ('Premier post', NOW(), 1, 1, 3);