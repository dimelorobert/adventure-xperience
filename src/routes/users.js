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
router.get('/list', usersController.list); // Anonimo
router.get('/:id', /*authentication.user,*/ usersController.get); // User

router.put('/update/:id', /*authentication.user, authentication.admin,*/ usersController.update); // User y Admin
router.delete('/delete/:id', /*userIsAuthenticated, userIsAdmin, */ usersController.delete); // Admin 

// Login
router.get('/:id/activate', usersController.activate); //admin
router.get('/:id/send-new-code', usersController.sendCode); // Anonimo
router.post('/:id/recovery/password', /*authentication.user, authentication.admin,*/ usersController.recoveryPassword); // user y admin
router.post('/login', usersController.login); // Anonimo
router.get('/:id/deactivate', usersController.deactivate); //admin
router.post('/:id/password', userIsAuthenticated, userIsAdmin, usersController.changePassword); // user y admin

module.exports = router;