'use strict';

const {
  usersSchema
} = require('./users');
const {
  categoriesSchema
} = require('./categories');
const {
  adventuresSchema
} = require('./adventures');
const {
  reviewsSchema
} = require('./reviews');
const {
  loginSchema
} = require('./login');
const {
  newPasswordSchema
} = require('./changePassword');
const {
  cartSchema
} = require('./cart');

module.exports = {
  usersSchema,
  categoriesSchema,
  adventuresSchema,
  reviewsSchema,
  loginSchema,
  newPasswordSchema,
  cartSchema
};