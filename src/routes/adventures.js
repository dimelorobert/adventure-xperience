'use strict';

const {
   adventuresController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();

const {
   userIsAuthenticated,
   userIsAdmin
} = require('../middlewares/auth')


router.post('/create', userIsAuthenticated, adventuresController.create); // User y Admin
router.get('/list', adventuresController.list); // Anonimo
router.get('/:id', adventuresController.get); // Anonimo
//router.get('/user/get/:id', adventureController.get); // Anonimo

router.put('/update/:id', /*userIsAuthenticated,*/ adventuresController.update); // User y Admin
router.delete('/delete/:id',
   /*userIsAuthenticated,
     userIsAdmin,*/
   adventuresController.delete); // User y Admin
module.exports = router;