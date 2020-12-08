'use strict';

// If you want to use ORM Sequelize connection
import connectionDB from './sequelizeConnection';

import structureDB from './structureDB';

import testSeq from './testSeq';

// If you want to use a natural MYSQL connection without ORM 'Sequelize'
// import connectionDB from './mysqlConnection';

export { connectionDB, testSeq, structureDB };
