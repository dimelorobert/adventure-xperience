'use strict';
const {
   userController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();
const {userAuthenticated} = require('../middlewares/auth')

router.post('/signup', userController.signup); // Anonimo
router.post('/login', userController.login); // Anonimo
//router.post('/:id/recovery/password', /*authentication.user, authentication.admin,*/ userController.recoveryPassword); // user y admin
router.post('/:id/password', userController.changePassword); // user y admin

router.get('/get/:id', /*authentication.user,*/ userController.get); // User
router.get('/list', userController.list); // Anonimo
router.put('/update/:id', /*authentication.user, authentication.admin,*/ userController.update); // User y Admin
router.delete('/delete/:id', userAuthenticated ,userController.delete); // Admin 

module.exports = router;