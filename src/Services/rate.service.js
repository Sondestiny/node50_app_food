import { defaultValueSchemable } from 'sequelize/lib/utils'
import { BadRequestException } from '../Common/helpers/exception.helper.js'
import sequelize, { models } from '../Common/Sequelizes/ConnectDB.js'
import { where } from 'sequelize'
const rateService = {
    // lấy danh sách theo user
    getRateByUserId : async (user_id) => {
        const likeList = await models.Rate_res.findAll({
            raw: true,
            where: {user_id},
            attributes : ['user_id', 'res_id', [sequelize.fn('COUNT', sequelize.col('res_id')), 'n_restaurant'] ],
            group: ['user_id', 'res_id']
        })
        // trường hợp không lấy được thông tin
        if (!likeList) throw new BadRequestException('Không tìm thấy thông tin rate của người dùng')
        // trường hợp thành công
        return likeList
    },
    getRateByResId : async (res_id) => {
        const likeList = await models.Rate_res.findAll({
            raw: true,
            where: {res_id},
            attributes : [ 'res_id','user_id', [sequelize.fn('COUNT', sequelize.col('user_id')), 'n_user'] ],
            group: ['user_id', 'res_id']
        })
        // trường hợp không lấy được thông tin
        if (!likeList) throw new BadRequestException('Không tìm thấy thông tin rate của nhà hàng')
        // trường hợp thành công
        return likeList
    },
    setRate: async (user_id, res_id, amount) => {
        const rate = await models.Rate_res.findOne({
            where: {user_id, res_id},
        })
        if (!rate){
            const newRate = await models.Rate_res.build({
                id:user_id,
                user_id,
                res_id,
                amount,
                date_rate: Date.now()
            })
            await newRate.save();
            return newRate;
        } 
        rate.amount = amount;
        rate.date_rate = Date.now();
        await rate.save();
        return rate;

    },
}
export default rateService