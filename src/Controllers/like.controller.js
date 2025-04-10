import { BadRequestException } from "../Common/helpers/exception.helper.js";
import { responseError, responseSuccess } from "../Common/helpers/response.helper.js";
import logger from "../Common/winston/init.winston.js";
import likeService from "../Services/like.service.js";

const likeController = {
    getLike: async (req, res, next) => {
        try {
            const {user_id, res_id} = req.query
            
            if(user_id&&res_id) throw new BadRequestException('Không thể tìm kiếm danh sách like')
            
            if(!user_id&&!res_id) throw new BadRequestException('Không thể tìm kiếm danh sách like')
            
            if(!res_id) {
                const result = await likeService.getLikeByUserId(+user_id);
                const response = responseSuccess(result, 'lấy thông tin danh sách thành công', 200);
                logger.info('lấy thông tin danh sách thành công');
                res.status(response.statusCode).json(response)
            } else {
                const result = await likeService.getLikeByResId(+res_id);
                const response = responseSuccess(result, 'lấy thông tin danh sách thành công', 200);
                logger.info('lấy thông tin danh sách thành công');
                res.status(response.statusCode).json(response)
            }
        } catch (error) {next(error)}  
    },

    setLike: async (req, res, next) => {
        try {
            const {user_id, res_id} = req.body
            console.log(user_id, res_id)    
            if(!res_id||!user_id) throw new BadRequestException('Không thể tạo like')
            const result = await likeService.setLike(+res_id, +user_id);
            const response = responseSuccess(result, 'like thành công', 200);
            logger.info('like thành công');
            res.status(response.statusCode).json(response)
        } catch (error) {next(error)}  
    },
    deleteLike: async (req, res, next) => {
        try {
            const {user_id, res_id} = req.body
            console.log(user_id, res_id)    
            if(!res_id||!user_id) throw new BadRequestException('Không thể xóa like')
            const result = await likeService.deleteLike(+res_id, +user_id);
            const response = responseSuccess(result, 'xóa like thành công', 200);
            logger.info('xóa like thành công');
            res.status(response.statusCode).json(response)
        } catch (error) {next(error)}  
    },

}


export default likeController