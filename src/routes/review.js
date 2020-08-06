'use strict';

const {
   reviewController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();


router.post('/adventure/:id', reviewController.vote); // User y Admin
router.get('/voted/adventure/:id', reviewController.get);
//router.get('/voted/user/adventure/:id', reviewController.get); // Anonimo
router.get('/adventure/list', reviewController.list); // Anonimo
router.put('/:id/update/adventure', reviewController.update); // Admin
router.delete('/:id/delete/adventure', reviewController.delete); // Admin

module.exports = router;