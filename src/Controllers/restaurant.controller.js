import { BadRequestException } from "../Common/helpers/exception.helper.js";
import { responseError, responseSuccess } from "../Common/helpers/response.helper.js";
import logger from "../Common/winston/init.winston.js";
import restaurantService from "../Services/restaurant.service.js";

restaurantService
const restaurantController = {
    findAll : async (req, res, next) => {
        try {
            const result = await restaurantService.findAll();
            const response = responseSuccess(result, 'lấy thông tin danh sách thành công', 200);
            logger.info('lấy thông tin danh sách thành công');
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    },
    getListLike: async (req, res, next) => {
        try {
            const {res_id} = req.params;
            logger.info(`res_id : ${+res_id}`)
            if(!res_id) throw new BadRequestException('Không tìm thấy res_id người dùng')
            const result = await restaurantService.getListLike(+res_id)
            const response = responseSuccess(result, 'lấy danh sách like thành công', 200)
            logger.info('lấy danh sách like thành công')
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
}


export default restaurantController