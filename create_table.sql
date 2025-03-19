-- KIỂM TRA VERSION
SELECT VERSION();
-- TẠO DATABASE
CREATE DATABASE IF NOT EXISTS app_food
USE app_food
-- Tạo table users, foods , orders, sub_foods, food_types, like_res, rate_res, restaurants

-- Tạo bảng người dùng
CREATE TABLE `Users` (
  `user_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `fullname` VARCHAR(255),
  `email` VARCHAR(255),
  `password` VARCHAR(255),
  `deletedBy` INT NOT NULL DEFAULT 0,
  `isDeleted` INT NOT NULL DEFAULT 0,
  `deletedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
-- Tạo bảng nhà hàng
CREATE TABLE `Restaurants` (
  `res_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `res_name` VARCHAR(255),
  `image` VARCHAR(255),
  `desc` VARCHAR(255),
  `deletedBy` INT NOT NULL DEFAULT 0,
  `isDeleted` INT NOT NULL DEFAULT 0,
  `deletedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
-- tạo bảng thức ăn
CREATE TABLE `Foods` (
  `food_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `food_name` VARCHAR(255),
  `image` VARCHAR(255),
  `price` FLOAT,
  `desc` VARCHAR(255),
  `type_id` INT,
  FOREIGN KEY (`type_id`) REFERENCES `Food_types`,
  `deletedBy` INT NOT NULL DEFAULT 0,
  `isDeleted` INT NOT NULL DEFAULT 0,
  `deletedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
-- tạo bảng loại thức ăn (type)
CREATE TABLE `Food_types` (
  `type_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `type_name` VARCHAR(255),
  `deletedBy` INT NOT NULL DEFAULT 0,
  `isDeleted` INT NOT NULL DEFAULT 0,
  `deletedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
-- Tạo bảng thông tin mô tả của thức ăn (Sub)
CREATE TABLE `Sub_foods` (
  `sub_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `sub_name` VARCHAR(255),
  `sub_price` FLOAT,
  `food_id` INT,
  FOREIGN KEY (`food_id`) REFERENCES `Foods`
)

-- Tạo bảng hóa đơn (đây sẽ là bảng mô tả mối quan hệ nhiều nhiều của users và foods)
CREATE TABLE `Orders` (
	`user_id` INT,
	FOREIGN KEY (`user_id`) REFERENCES `Users`,
	`food_id` INT,
	FOREIGN KEY (`food_id`) REFERENCES `Foods`,
	`amount` INT,
	`arr_sub_id` VARCHAR(255) ,
	`code` INT
)

-- Tạo bảng những lượt đáng giá của khách hàng (đây sẽ là bảng thể hiện mối quan hệ nhiều nhiều của users và restaurant)
CREATE TABLE `Rate_res` (
	`user_id` INT,
	FOREIGN KEY (`user_id`) REFERENCES `Users`,
	`res_id` INT,
	FOREIGN KEY (`res_id`) REFERENCES `Restaurants`,
	`amount` INT,
	`date_rate` DATETIME
)
-- Tạo bảng những lượt like của khách hàng (đây sẽ là bảng thể hiện mối quan hệ nhiều nhiều của users và restaurant)
CREATE TABLE `Like_res` (
	`user_id` INT,
	FOREIGN KEY (`user_id`) REFERENCES `Users`,
	`res_id` INT,
	FOREIGN KEY (`res_id`) REFERENCES `Restaurants`,
	`date_like` DATETIME
)