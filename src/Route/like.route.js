import express from 'express';
import userController from '../Controllers/user.controller.js';
import likeController from '../Controllers/like.controller.js';

const likeRouter = express.Router();
// lấy danh sách like
likeRouter.get('/getList', likeController.getLike)
// like
likeRouter.post('', likeController.setLike)
//xóa
likeRouter.delete('', likeController.deleteLike)
export default likeRouter;