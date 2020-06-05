'use strict';

const routerx = require('express-promise-router');
const userRouter = require('./user');

const router = routerx();

router.use('/user', userRouter);

module.exports = router;
