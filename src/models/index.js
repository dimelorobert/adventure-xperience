'use strict';
const { userSchema } = require('./user');
const { categorySchema } = require('./category');
const { AdventureSchema } = require('./adventure');
const { chatSchema } = require('./chat');
const { cartSchema } = require('./cart');
const { reviewSchema } = require('./review');

module.exports = {
  userSchema,
  categorySchema,
  AdventureSchema,
  cartSchema,
  chatSchema,
  reviewSchema
};
