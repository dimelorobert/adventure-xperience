'use strict';

const {
   reviewController
} = require('../controllers');
const routerx = require('express-promise-router');
const router = routerx();

router.post('/adventure/:id', reviewController.vote);
router.get('/voted/adventure/:id', reviewController.get);
router.get('/adventure/list', reviewController.list);
router.put('/:id/update/adventure', reviewController.update);
router.delete('/:id/delete/adventure', reviewController.delete);

module.exports = router;