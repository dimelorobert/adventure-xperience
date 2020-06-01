'use strict';

const { getConnection } = require('../database');
const { categoriesSchema } = require('../models/');
const { formatDateToDB, errorGenerator } = require('../helpers');
let connection;
