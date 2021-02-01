import getConnection from "../../../database";

let connectionDB;

async function getUserById(request, response, next) {
  connectionDB = await getConnection();
  try {
    const { id } = request.params;

    const [result] = await connectionDB.query(
      `
        SELECT * 
        FROM users 
        WHERE id = ?`,
      [id]
    );

    if (!result.length) {
      return response.status(400).json({
        message: `El usuario no existe, por favor intentalo de nuevo`,
      });
    }

    response.status(200).json({ user: result });
  } catch (error) {
    next(error);
  } finally {
    await connectionDB.release();
  }
}
export default getUserById;
