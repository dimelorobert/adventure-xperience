'use strict';

const routerx = require('express-promise-router');
const userRouter = require('./user');
const categoryRouter = require('./category');
const adventureRouter = require('./adventure');
const reviewRouter = require('./review');

const router = routerx();

router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/adventure', adventureRouter);
router.use('/review', reviewRouter);


module.exports = router;