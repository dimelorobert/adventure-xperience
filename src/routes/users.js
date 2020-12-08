'use strict';
import routerx from 'express-promise-router';
import usersControllers from '../controllers/users/create';

const router = routerx();

/*const {
   userIsAuthenticated,
   userIsAdmin
} = require('../middlewares/auth')*/

// CRUD (Create, Read, Update, Delete)
router.post('/create', usersControllers); // Anonimo
//router.get('/list', uList); // Anonimo

export default router;
