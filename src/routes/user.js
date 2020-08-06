'use strict';
const {
   userController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();
<<<<<<< HEAD
const {
   userIsAuthenticated,
   userIsAdmin
} = require('../middlewares/auth')
=======
const {userAuthenticated, userIsAdmin} = require('../middlewares/auth')
>>>>>>> 61ebaa803733208895c8982ac4b84ab3a6310962

router.post('/signup', userController.signup); // Anonimo
router.post('/login', userController.login); // Anonimo
//router.post('/:id/recovery/password', /*authentication.user, authentication.admin,*/ userController.recoveryPassword); // user y admin
router.post('/:id/password', userIsAuthenticated, userController.changePassword); // user y admin

router.get('/get/:id', /*authentication.user,*/ userController.get); // User
router.get('/list', userController.list); // Anonimo
router.put('/update/:id', /*authentication.user, authentication.admin,*/ userController.update); // User y Admin
<<<<<<< HEAD
router.delete('/delete/:id', userIsAuthenticated, userIsAdmin, userController.delete); // Admin 
=======
router.delete('/delete/:id', userAuthenticated ,userIsAdmin, userController.delete); // Admin 
>>>>>>> 61ebaa803733208895c8982ac4b84ab3a6310962

module.exports = router;