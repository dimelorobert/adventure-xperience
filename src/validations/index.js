'use strict';

const {
  usersSchema
} = require('./users');
const {
  registerUsersSchema,
} = require('./registerUserSchema')
const {
  updateDataUsersSchema
} = require('./updateDataUser')
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
  registerUsersSchema,
  updateDataUsersSchema,
  categoriesSchema,
  adventuresSchema,
  reviewsSchema,
  loginSchema,
  newPasswordSchema,
  cartSchema
};