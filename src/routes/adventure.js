'use strict';

const {
   adventureController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();
const {
   authentication
} = require('../middlewares');

router.post('/new', authentication.user, authentication.admin, adventureController.new); // User y Admin
router.get('/get/:id', adventureController.get); // Anonimo
//router.get('/user/get/:id', adventureController.get); // Anonimo
router.get('/list', adventureController.list); // Anonimo
router.put('/update/:id', authentication.user, authentication.admin, adventureController.update); // User y Admin
router.delete('/delete/:id', authentication.user, authentication.admin, adventureController.delete); // User y Admin
module.exports = router;