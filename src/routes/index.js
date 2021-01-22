'use strict';

import routerx from 'express-promise-router';

import usersRouter from '../components/users/routes';

const router = routerx();

router.use('/users', usersRouter);
 /*router.use('/categories', categoriesRouter);
router.use('/adventures', adventuresRouter);
router.use('/reviews', reviewsRouter);
router.use('/cart', cartRouter);*/


export default router;