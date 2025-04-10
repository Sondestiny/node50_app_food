import { BadRequestException } from "../Common/helpers/exception.helper.js";
import { responseError, responseSuccess } from "../Common/helpers/response.helper.js";
import logger from "../Common/winston/init.winston.js";
import likeService from "../Services/like.service.js";
import rateService from "../Services/rate.service.js";

const rateController = {
    getRate: async (req, res, next) => {
        try {
            const {user_id, res_id} = req.query
            
            if(user_id&&res_id) throw new BadRequestException('Không thể tìm kiếm danh sách rate')
            
            if(!user_id&&!res_id) throw new BadRequestException('Không thể tìm kiếm danh sách rate')
            
            if(!res_id) {
                const result = await rateService.getRateByUserId(+user_id);
                const response = responseSuccess(result, 'lấy thông tin danh sách rate thành công', 200);
                logger.info('lấy thông tin danh sách rate thành công');
                res.status(response.statusCode).json(response)
            } else {
                const result = await rateService.getRateByResId(+res_id);
                const response = responseSuccess(result, 'lấy thông tin danh sách rate thành công', 200);
                logger.info('lấy thông tin danh sách rate thành công');
                res.status(response.statusCode).json(response)
            }
        } catch (error) {next(error)}  
    },

    setRate: async (req, res, next) => {
        try {
            const {user_id, res_id, amount} = req.body
            console.log(user_id, res_id)    
            if(!res_id||!user_id) throw new BadRequestException('Không thể tạo rate')
            const result = await rateService.setRate(+res_id, +user_id, +amount);
            const response = responseSuccess(result, 'tạo rate thành công', 200);
            logger.info('tạo rate thành công');
            res.status(response.statusCode).json(response)
        } catch (error) {next(error)}  
    },
}


export default rateController