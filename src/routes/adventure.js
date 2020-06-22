'use strict';

const { adventureController } = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();

router.post('/new', adventureController.new);
router.get('/get/:id', adventureController.get);
router.get('/list', adventureController.list);
router.put('/update/:id', adventureController.update); 
router.delete('/delete/:id', adventureController.delete); 
module.exports = router;