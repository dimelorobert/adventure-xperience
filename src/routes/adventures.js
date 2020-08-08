'use strict';

const {
   adventuresController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();


router.post('/new', /*authentication.user, authentication.admin,*/ adventuresController.create); // User y Admin
router.get('/get/:id', adventuresController.get); // Anonimo
//router.get('/user/get/:id', adventureController.get); // Anonimo
router.get('/list', adventuresController.list); // Anonimo
router.put('/update/:id', /*authentication.user, authentication.admin,*/ adventuresController.update); // User y Admin
router.delete('/delete/:id', /*authentication.user, authentication.admin,*/ adventuresController.delete); // User y Admin
module.exports = router;