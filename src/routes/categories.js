'use strict';
const { categoriesController } = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();


router.post('/create', /*authentication.user,*/ categoriesController.create); // Admin
router.get('/get/:id', categoriesController.get); // Anonimo
router.get('/list', categoriesController.list); // Anonimo
router.put('/update/:id', categoriesController.update); // Admin
router.delete('/delete/:id', /*authentication.user,*/ categoriesController.delete); // Admin
module.exports = router;