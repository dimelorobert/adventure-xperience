'use strict';

const routerx = require('express-promise-router');
const usersRouter = require('./users');
const categoriesRouter = require('./categories');
const adventuresRouter = require('./adventures');
const reviewsRouter = require('./reviews');
const cartRouter = require('./cart');

const router = routerx();

router.use('/users', usersRouter);
router.use('/categories', categoriesRouter);
router.use('/adventures', adventuresRouter);
router.use('/reviews', reviewsRouter);
router.use('/cart', cartRouter);


module.exports = router;