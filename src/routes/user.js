'use strict';
const { userController } = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();

router.post('/new', userController.new);
router.get('/get/:id', userController.get);
router.get('/list', userController.list);
router.put('/update/:id', userController.update);
router.delete('/delete/:id', userController.delete);

module.exports = router;
