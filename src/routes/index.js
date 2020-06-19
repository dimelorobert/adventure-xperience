'use strict';

const routerx = require('express-promise-router');
const userRouter = require('./user');
const categoryRouter = require('./category');

const router = routerx();

router.use('/user', userRouter);
router.use('/category', categoryRouter);


module.exports = router;
