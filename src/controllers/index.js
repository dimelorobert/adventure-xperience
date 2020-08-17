'use strict';

const { usersController } = require('./users');
const { adventuresController } = require('./adventures');
const { categoriesController } = require('./categories');
const { reviewsController } = require('./reviews')
const {
   cartsController
} = require('./carts')
module.exports = { usersController, categoriesController, adventuresController, reviewsController, cartsController};
