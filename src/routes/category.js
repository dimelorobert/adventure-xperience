'use strict';
const { categoryController } = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();

router.post('/add', categoryController.add);
/* router.get('/:id', categoryController.get);
router.post('/signup', categoryController.signup);
router.delete('/delete/:id', categoryController.delete);
 */
module.exports = router;