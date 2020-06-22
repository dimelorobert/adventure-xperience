'use strict';
const { userSchema } = require('./user');
const { categorySchema } = require('./category');
const { adventureSchema } = require('./adventure');
const { chatSchema } = require('./chat');
const { cartSchema } = require('./cart');
const { reviewSchema } = require('./review');

module.exports = {
  userSchema,
  categorySchema,
  adventureSchema,
  cartSchema,
  chatSchema,
  reviewSchema
};
