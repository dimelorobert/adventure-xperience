'use strict';
const {
   userController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();
const {
   authentication
} = require('../middlewares');

router.post('/new', userController.new); // Anonimo
router.post('/login', userController.login); // Anonimo
router.get('/get/:id', authentication.user, userController.get); // User
router.get('/list', userController.list); // Anonimo
router.put('/update/:id', authentication.user, authentication.admin, userController.update); // User y Admin
router.delete('/delete/:id', authentication.admin, userController.delete); // Admin 

module.exports = router;