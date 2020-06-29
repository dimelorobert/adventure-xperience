'use strict';

/*const schemas = {
  user: require('./user'),
  category: require('./category'),
  adventure: require('./adventure'),
  chat: require('./chat'),
  cart: require('./cart'),
  review: require('./review'),
  login: require('./login')
}

module.exports = {schemas};*/
const {
  userSchema
} = require('./user');
const {
  categorySchema
} = require('./category');
const {
  adventureSchema
} = require('./adventure');
const {
  chatSchema
} = require('./chat');
const {
  cartSchema
} = require('./cart');
const {
  reviewSchema
} = require('./review');
const {
  loginSchema
} = require('./login');

module.exports = {
  userSchema,
  categorySchema,
  adventureSchema,
  cartSchema,
  chatSchema,
  reviewSchema,
  loginSchema
};