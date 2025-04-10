import express from 'express';
import rateController from '../Controllers/rate.controller .js';

const rateRouter = express.Router();
// lấy danh sách like
rateRouter.get('/getList', rateController.getRate)
// like
rateRouter.post('', rateController.setRate)
export default rateRouter;