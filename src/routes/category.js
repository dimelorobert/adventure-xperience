'use strict';
const { categoryController } = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();
const {
   authentication
} = require('../middlewares');

router.post('/new', authentication.admin, categoryController.new); // Admin
router.get('/get/:id', categoryController.get); // Anonimo
router.get('/list', categoryController.list); // Anonimo
router.put('/update/:id', categoryController.update); // Admin
router.delete('/delete/:id', authentication.admin, categoryController.delete); // Admin
module.exports = router;