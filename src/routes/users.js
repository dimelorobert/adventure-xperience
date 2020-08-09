'use strict';
const {
   usersController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();

const {
   userIsAuthenticated,
   userIsAdmin
} = require('../middlewares/auth')

// CRUD (Create, Read, Update, Delete)
router.post('/create', usersController.create); // Anonimo
router.get('/:id', /*authentication.user,*/ usersController.get); // User
router.get('/list', usersController.list); // Anonimo
router.put('/update/:id', /*authentication.user, authentication.admin,*/ usersController.update); // User y Admin
router.delete('/delete/:id', /*userIsAuthenticated, userIsAdmin, */ usersController.delete); // Admin 

// Login
router.post('/login', usersController.login); // Anonimo
router.get('/:id/send-new-code', usersController.sendCode); // Anonimo
router.get('/:id/activate', usersController.activate);
//router.post('/:id/recovery/password', /*authentication.user, authentication.admin,*/ userController.recoveryPassword); // user y admin
//router.post('/:id/password', /* userIsAuthenticated,*/ usersController.changePassword); // user y admin

module.exports = router;