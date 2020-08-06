'use strict';
const {
   userController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();
const {
   userIsAuthenticated,
   userIsAdmin
} = require('../middlewares/auth')

router.post('/signup', userController.signup); // Anonimo
router.post('/login', userController.login); // Anonimo
//router.post('/:id/recovery/password', /*authentication.user, authentication.admin,*/ userController.recoveryPassword); // user y admin
router.post('/:id/password', userIsAuthenticated, userController.changePassword); // user y admin

router.get('/get/:id', /*authentication.user,*/ userController.get); // User
router.get('/list', userController.list); // Anonimo
router.put('/update/:id', /*authentication.user, authentication.admin,*/ userController.update); // User y Admin
router.delete('/delete/:id', userIsAuthenticated, userIsAdmin, userController.delete); // Admin 

module.exports = router;