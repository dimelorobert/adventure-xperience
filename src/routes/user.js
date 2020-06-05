'use strict';
const { userController } = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();

router.get('/list', userController.list);
router.post('/signup', userController.signup);
router.delete('/delete/:id', userController.delete);

module.exports = router;
