'use strict';

const {
   reviewController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();
const {
   authentication
} = require('../middlewares');

router.post('/adventure/:id', authentication.user, authentication.admin, reviewController.vote); // User y Admin
router.get('/voted/adventure/:id', reviewController.get);
//router.get('/voted/user/adventure/:id', authentication.user, authentication.admin,reviewController.get); // Anonimo
router.get('/adventure/list', reviewController.list); // Anonimo
router.put('/:id/update/adventure', authentication.user, authentication.admin, reviewController.update); // User y Admin
router.delete('/:id/delete/adventure', authentication.user, authentication.admin, reviewController.delete); // User y Admin

module.exports = router;