import express from 'express';
import restaurantController from '../Controllers/restaurant.controller.js';

const restaurantRouter = express.Router();

restaurantRouter.get('/findAll', restaurantController.findAll);
restaurantRouter.get('/:res_id', restaurantController.getListLike)

export default restaurantRouter;
