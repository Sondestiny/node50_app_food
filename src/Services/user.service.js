import { BadRequestException } from '../Common/helpers/exception.helper.js'
import sequelize, { models } from '../Common/Sequelizes/ConnectDB.js'
const userService = {
    // Tìm danh sách tất cả người dùng
    findAll : async (req) => {
        const users = await models.Users.findAll({raw: true})
        if (!users) throw new BadRequestException('Không tìm thấy thông tin người dùng')
        return users
    },
    order: async (user_id, food_id, amount, code, arr_sub_id)=> {
        
        const newOrder = await models.Orders.build({
            id: user_id,
            user_id,
            food_id, 
            amount, 
            code, 
            arr_sub_id
        })
        await newOrder.save();
        return newOrder
    }
}
export default userService