import express from 'express';
import userController from '../Controllers/user.controller.js';

const useRouter = express.Router();

useRouter.get('/findAll', userController.findAll);

useRouter.post('/order/:user_id', userController.order);


export default useRouter;