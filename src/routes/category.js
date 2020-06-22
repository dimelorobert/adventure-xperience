'use strict';
const { categoryController } = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();

router.post('/new', categoryController.new);
router.get('/get/:id', categoryController.get);
router.get('/list', categoryController.list);
router.put('/update/:id', categoryController.update); 
router.delete('/delete/:id', categoryController.delete); 
module.exports = router;