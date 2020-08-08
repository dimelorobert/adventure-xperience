'use strict';

const {
   reviewsController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();


router.post('/adventure/:id', reviewsController.vote); // User y Admin
router.get('/voted/adventure/:id', reviewsController.get);
//router.get('/voted/user/adventure/:id', reviewsController.get); // Anonimo
router.get('/adventure/list', reviewsController.list); // Anonimo
router.put('/:id/update/adventure', reviewsController.update); // Admin
router.delete('/:id/delete/adventure', reviewsController.delete); // Admin

module.exports = router;