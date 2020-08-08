'use strict';

const { usersController } = require('./users');
const { adventuresController } = require('./adventures');
const { categoriesController } = require('./categories');
const { reviewsController } = require('./reviews')

module.exports = { usersController, categoriesController, adventuresController, reviewsController };
