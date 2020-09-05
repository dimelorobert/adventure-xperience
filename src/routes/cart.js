'use strict';

const {
   cartsController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();
const {
   userIsAuthenticated,
   userIsAdmin
} = require('../middlewares/auth')


router.post('/my-shopping-cart', userIsAuthenticated, cartsController.create); // User y Admin
/*router.get('/voted/adventure/:id', cartController.get);
//router.get('/voted/user/adventure/:id', cartController.get); // Anonimo
router.get('/adventure/list', cartController.list); // Anonimo
router.put('/:id/update/adventure', cartController.update); // Admin
router.delete('/:id/delete/adventure', cartController.delete); // Admin*/

module.exports = router;