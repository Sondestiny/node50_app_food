import { BadRequestException } from "../Common/helpers/exception.helper.js";
import { responseError, responseSuccess } from "../Common/helpers/response.helper.js";
import logger from "../Common/winston/init.winston.js";
import userService from "../Services/user.service.js"

const userController = {
    findAll : async (req, res, next) => {
        try {
            const result = await userService.findAll();
            const response = responseSuccess(result, 'lấy thông tin danh sách thành công', 200);
            logger.info('lấy thông tin danh sách thành công');
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    },
    order: async (req, res, next) => {
        try {
            const {user_id} = req.params;
            const {food_id, amount, code, arr_sub_id} = req.body;

            

            if(!user_id) throw new BadRequestException('Không tìm thấy user_id người dùng')

            const result = await userService.order(+user_id , +food_id, amount, code, arr_sub_id)

            const response = responseSuccess(result, 'order thành công', 200)
            logger.info('order thành công')
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    },
}


export default userController