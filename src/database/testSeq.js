'use strict';

import connectionDB from './sequelizeConnection';

const testSeq = async () => {
  try {
    await connectionDB.authenticate();
    console.log('✅ Connection to MYSQL database is working ✅');
  } catch (error) {
    console.log('⛔⛔⛔ It was an error in database connection ⛔⛔⛔', error);
  }
};
testSeq();

export default testSeq;
