USE app_food;
-- Chèn data food_type phải chèn trước Food do lỗi foregin_key
INSERT INTO `Food_types` (`type_name`) 
VALUES 
	('món cơm'),
	('món rán'),
	('món canh'),
	('món kho')
-- Chèn data foods
INSERT INTO `Foods` (`food_name`, `image`, `price`, `desc`, `type_id`) 
VALUES 
	('Cơm rang','ảnh đĩa cơm rang', 30.0, 'Một đĩa cơm rang bao gồm: cơm, trứng, thịt,...', 1),
	('Trứng rán','ảnh đĩa trứng rán', 10.0, 'Một đĩa trứng rán bao gồm: trứng, dầu...', 2),
	('Canh rau','ảnh bát canh rau', 5.0, 'Một đĩa cơm rang bao gồm: nước, rau...', 3),
	('thịt kho','ảnh đĩa thịt kho', 40.0, 'Một đĩa cơm rang bao gồm: thịt, hành, đường màu...', 4)
	

INSERT INTO `Restaurants` (`res_name`, `image`, `desc`) 
VALUES 
	('nhà hàng số 1', 'ảnh nhà hàng 1', 'nhà hàng ở 1'),
	('nhà hàng Số 2', 'ảnh nhà hàng 2', 'nhà hàng ở 2'),
	('nhà hàng Số 3', 'ảnh nhà hàng 3', 'nhà hàng ở 3'),
	('nhà hàng Số 4', 'ảnh nhà hàng 4', 'nhà hàng ở 4'),
	('nhà hàng Số 5', 'ảnh nhà hàng 5', 'nhà hàng ở 5'),
	('nhà hàng Số 6', 'ảnh nhà hàng 6', 'nhà hàng ở 6')

INSERT INTO `Users` (`fullname`, `email`, `password`) 
VALUES 
	('Bùi Văn M', 'M@gmail.ccom', '123456'),
	('Bùi Văn N', 'n@gmail.ccom', '123456'),
	('Bùi Văn C', 'c@gmail.ccom', '123456'),
	('Bùi Văn D', 'd@gmail.ccom', '123456'),
	('Bùi Văn E', 'e@gmail.ccom', '123456'),
	('Bùi Văn F', 'f@gmail.ccom', '123456'),
	('Bùi Văn G', 'g@gmail.ccom', '123456'),
	('Bùi Văn H', 'h@gmail.ccom', '123456'),
	('Bùi Văn K', 'k@gmail.ccom', '123456'),
	('Bùi Văn L', 'l@gmail.ccom', '123456'),
	('Bùi Văn J', 'j@gmail.ccom', '123456'),
	('Bùi Văn X', 'x@gmail.ccom', '123456')
-- trèn dữ liệu lượt like của khách hàng và nhà hàng trên table Like_res
INSERT INTO `Like_res` (`user_id`,`res_id`) VALUE (FLOOR(RAND()*11)+1, FLOOR(RAND()*9)+1)

-- trèn dữ liệu lượt rate của khách hàng và nhà hàng trên table Like_res
INSERT INTO `Rate_res` (`user_id`,`res_id`, `amount`) VALUE (FLOOR(RAND()*12)+1, FLOOR(RAND()*9)+1, FLOOR(RAND()*4)+1)

-- Trèn dữ liệu các đơn hàng trong bảng Orders
INSERT INTO `Orders` (`user_id`, `food_id`, `amount`, `arr_sub_id`, `code`) 
VALUE ( FLOOR(RAND()*11)+1 , FLOOR(RAND()*4)+5 , FLOOR(RAND()*3)+1 , 'đây là column arr_sub', 123456)