// required modules to use
import getConnection from '../../../database';

// we define the variable to connect to db
let connectionDB;

async function getUsers(response, next) {
   try {
      // open connection to db
      connectionDB = await getConnection();

      // we build a SQL query to list all users
      const [userList] = await connectionDB.query('SELECT * FROM users;');
      if (!userList) {
         return response.status(400).send({ message: 'No hay resultados' });
      }

      // if everything it's ok we sen a json
      response.status(200).json({
         users: userList,
      });
   } catch (error) {
      console.log('[ERROR] line:23 ');
      next(error);
   } finally {
      if (!connectionDB) await connectionDB.release();
   }
}

export default getUsers;
