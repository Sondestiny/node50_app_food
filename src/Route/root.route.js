import express from 'express';
import useRouter from './user.route.js';
import likeRouter from './like.route.js';
import restaurantRouter from './restaurant.route.js';
import rateRouter from './rate.route..js';

const rootRouter = express.Router();

rootRouter.use('/user', useRouter)
rootRouter.use('/restaurant', restaurantRouter)
rootRouter.use('/like', likeRouter)
rootRouter.use('/rate', rateRouter)


export default rootRouter;