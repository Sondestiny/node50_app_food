USE app_food;
-- Tìm 05 người đã like nhà hàng địa chỉ id=06 nhiều nhất
SELECT fullname as 'tên người dùng' , COUNT(fullname) as 'Số lượt like'
FROM `Users`
INNER JOIN `Like_res` ON `Users`.user_id = `Like_res`.user_id
WHERE res_id = 6
GROUP BY (fullname)
ORDER BY 'Số lượt like' DESC
LIMIT 5
-- Tìm ra 02 nhà hàng có lượt like nhiều nhất (easy)
SELECT res_name , COUNT(res_name) AS luot_like_nhieu_nhat
FROM `Like_res`
LEFT JOIN `Restaurants` ON `Restaurants`.res_id = `Like_res`.res_id
GROUP BY (res_name)
ORDER BY (luot_like_nhieu_nhat) DESC
LIMIT 2
-- Tìm người đã đặt nhà hàng nhiều nhất
SELECT Orders.user_id , fullname, COUNT(Orders.user_id) AS luot_order_nhieu_nhat
FROM `Orders`
LEFT JOIN `Users` ON `Orders`.user_id =`Users`.user_id
GROUP BY (Orders.user_id)
ORDER BY (luot_order_nhieu_nhat) DESC
LIMIT 1
-- Tìm người dùng không hoạt động trong hệ thống (Không like, không order, không rate)
SELECT `Users`.user_id, fullname, email FROM `Users` 
LEFT JOIN `Like_res` ON `Users`.user_id =`Like_res`.user_id
LEFT JOIN `Rate_res` ON `Users`.user_id =`Rate_res`.user_id
LEFT JOIN `Orders` ON `Users`.user_id =`Orders`.user_id
WHERE `Orders`.food_id IS NULL AND `Like_res`.res_id IS NULL AND `Rate_res`.res_id IS NULL