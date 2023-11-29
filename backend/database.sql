-- Create the schema
CREATE SCHEMA IF NOT EXISTS `ts_wild_wall`;

-- Create the "role" table
CREATE TABLE IF NOT EXISTS `ts_wild_wall`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(45) NOT NULL,
  `role_code` VARCHAR(45) NOT NULL
);

-- Create the "statut" table
CREATE TABLE IF NOT EXISTS `ts_wild_wall`.`statut` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `statut_name` VARCHAR(45) NOT NULL
);

-- Create the "user" table with a foreign key "role_id" and a unique constraint on the "username" field
CREATE TABLE IF NOT EXISTS `ts_wild_wall`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(45) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role_id` INT NOT NULL,
  FOREIGN KEY (`role_id`) REFERENCES `ts_wild_wall`.`role`(`id`)
);

-- Create the "color" table
CREATE TABLE IF NOT EXISTS `ts_wild_wall`.`color` (
  `id` INT NOT NULL PRIMARY KEY,
  `color_name` VARCHAR(45) NOT NULL,
  `color_code` VARCHAR(45) NOT NULL
);

-- Create the "post" table with foreign keys "statut_id", "user_id", and "color_id" and ON DELETE CASCADE
CREATE TABLE IF NOT EXISTS `ts_wild_wall`.`post` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `post_text` VARCHAR(255) NOT NULL,
  `post_date` DATETIME NOT NULL,
  `statut_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `color_id` INT NOT NULL,
  FOREIGN KEY (`statut_id`) REFERENCES `ts_wild_wall`.`statut`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `ts_wild_wall`.`user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`color_id`) REFERENCES `ts_wild_wall`.`color`(`id`)
);

-- Insert data into the "role" table
INSERT IGNORE INTO `ts_wild_wall`.`role` (`id`, `role_name`, `role_code`)
VALUES ('1', 'admin', '2013'),
       ('2', 'delegate', '4004'),
       ('3', 'wilder', '5067');

-- Insert data into the "statut" table
INSERT IGNORE INTO `ts_wild_wall`.`statut` (`id`, `statut_name`)
VALUES ('1', 'main_wall'),
       ('2', 'archived');

-- Insert data into the "color" table
INSERT IGNORE INTO `ts_wild_wall`.`color` (`id`, `color_name`, `color_code`)
VALUES ('1', 'green', '#c7ebb3'),
       ('2', 'pink', '#ffd5f8'),
       ('3', 'blue', '#c5e8f1'),
       ('4', 'yellow', '#f8eaae');

-- Insert the user "Romain" with the password "Romain" and the role "admin"
INSERT INTO `ts_wild_wall`.`user` (`username`, `password`, `role_id`)
VALUES ('Romain', '$2b$10$tz2Kn/x6zFIxy77Aq6bQQedNcbGoJNoJO1g4RGfTiOeAfflYCwTuO', 1);

-- Insert three users with the role "wilder"
INSERT INTO `ts_wild_wall`.`user` (`username`, `password`, `role_id`)
VALUES 
  ('User1', '$2b$10$tz2Kn/x6zFIxy77Aq6bQQedNcbGoJNoJO1g4RGfTiOeAfflYCwTuO', 3),
  ('User2', '$2b$10$tz2Kn/x6zFIxy77Aq6bQQedNcbGoJNoJO1g4RGfTiOeAfflYCwTuO', 3),
  ('User3', '$2b$10$tz2Kn/x6zFIxy77Aq6bQQedNcbGoJNoJO1g4RGfTiOeAfflYCwTuO', 3);

-- Insert the post "First post" with the blue color on the current date
INSERT INTO `ts_wild_wall`.`post` (`post_text`, `post_date`, `statut_id`, `user_id`, `color_id`)
VALUES ('Inauguration du tableau avec une première note !', NOW(), 1, 1, 3);
