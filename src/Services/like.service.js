import { defaultValueSchemable } from 'sequelize/lib/utils'
import { BadRequestException } from '../Common/helpers/exception.helper.js'
import sequelize, { models } from '../Common/Sequelizes/ConnectDB.js'
import { where } from 'sequelize'
const likeService = {
    // lấy danh sách theo user
    getLikeByUserId : async (user_id) => {
        const likeList = await models.Like_res.findAll({
            raw: true,
            where: {user_id},
            attributes : ['user_id', 'res_id', [sequelize.fn('COUNT', sequelize.col('res_id')), 'n_restaurant'] ],
            group: ['user_id', 'res_id']
        })
        // trường hợp không lấy được thông tin
        if (!likeList) throw new BadRequestException('Không tìm thấy thông tin người dùng')
        // trường hợp thành công
        return likeList
    },
    getLikeByResId : async (res_id) => {
        const likeList = await models.Like_res.findAll({
            raw: true,
            where: {res_id},
            attributes : [ 'res_id','user_id', [sequelize.fn('COUNT', sequelize.col('user_id')), 'n_user'] ],
            group: ['user_id', 'res_id']
        })
        // trường hợp không lấy được thông tin
        if (!likeList) throw new BadRequestException('Không tìm thấy thông tin người dùng')
        // trường hợp thành công
        return likeList
    },
    setLike: async (user_id, res_id) => {
        const like = await models.Like_res.findOne({
            where: {user_id, res_id},
        })
        // trường hợp người dùng đã like
        if (like) throw new BadRequestException('Không thể tạo like do người dùng đã like nhà hàng này');
        // trường hợp chưa like thì tạo và lưu lại
        const newLike = await models.Like_res.create({
            id:user_id,
            user_id,
            res_id,
            date_rate: Date.now()
        })
        // await newLike.save()
        return newLike;
    },
    deleteLike: async (user_id, res_id)=> {
        const like = await models.Like_res.destroy({
            where: {user_id, res_id}
        })
        return like;
    }
}
export default likeService