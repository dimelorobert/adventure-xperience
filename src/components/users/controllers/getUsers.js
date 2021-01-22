import getConnection from "../../../database";
let connectionDB;

async function getUsers(request, response, next) {
  connectionDB = await getConnection();
  try {
    // we build a SQL query to list all users
    const [result] = await connectionDB.query(
      `SELECT id, name, surname, address, telephone, city, country, email, password, create_at, update_at, is_admin, is_account_active, ip FROM users;`
    );

    response.status(200).json({
      users: result,
    });
  } catch (error) {
    response.status(400).send({ message: "No hay resultados" });
    next(error);
  } finally {
    await connectionDB.release();
  }
}
export default getUsers;
