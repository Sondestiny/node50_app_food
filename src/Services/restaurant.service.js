import { BadRequestException } from '../Common/helpers/exception.helper.js'
import sequelize, { models } from '../Common/Sequelizes/ConnectDB.js'
const restaurantService = {
    findAll : async () => {
        const restaurants = await models.Restaurants.findAll({raw: true})
        // trường hợp không lấy được thông tin
        if (!restaurants) throw new BadRequestException('Không tìm thấy danh sách nhà hàng')
        // trường hợp thành công
        return restaurants
    },
    getListLike: async (res_id) => {
        console.log(models.Like_res)
        const likeList = await models.Like_res.findAll({
            raw: true,
            where: {res_id},
            attributes: [
                'res_id',
                [sequelize.fn('count', sequelize.col(`user_id`)), 'user_like_res_count'],

            ],
            group: ['res_id'],
        })

        // trường hợp không lấy được thông tin
        // if (!likeList) throw new BadRequestException('Không tìm thấy danh sách like')
        // trường hợp thành công
        return likeList
    }
}
export default restaurantService