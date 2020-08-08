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


router.post('/create', usersController.create); // Anonimo
router.post('/login', usersController.login); // Anonimo
//router.post('/:id/recovery/password', /*authentication.user, authentication.admin,*/ userController.recoveryPassword); // user y admin
router.post('/:id/password',/* userIsAuthenticated,*/ usersController.changePassword); // user y admin

router.get('/get/:id', /*authentication.user,*/ usersController.get); // User
router.get('/list', usersController.list); // Anonimo
router.put('/update/:id', /*authentication.user, authentication.admin,*/ usersController.update); // User y Admin
router.delete('/delete/:id', /*userIsAuthenticated, userIsAdmin, */ usersController.delete); // Admin 


module.exports = router;