'use strict';

const { userController } = require('./user');
const { adventureController } = require('./adventure');
const { categoryController } = require('./category');
const { reviewController } = require('./review')

module.exports = { userController, categoryController, adventureController, reviewController };
