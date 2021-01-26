import { sign, verify } from "jsonwebtoken";
import getConnection from "../database";

const { SECRET_KEY } = process.env;

let connectionDB;

export async function checkToken(token) {
  try {
    let id = null;
    const { _id } = await readToken(token);
    id = _id;
    connectionDB = await getConnection();

    const [
      user,
    ] = await connectionDB.query(
      `SELECT id, is_admin FROM users WHERE id=? AND is_account_active=1`,
      [id]
    );
    if (user.length) {
      const token = generateToken(id);
      let tokenPayload = { token: token, is_admin: user[0].is_admin };
      return tokenPayload;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export async function generateToken(_id) {
  const token = sign({ id: _id }, SECRET_KEY, { expiresIn: "15m" });
  return token;
}

export async function readToken(token) {
  try {
    connectionDB = await getConnection();
    const { _id } = await verify(token, SECRET_KEY);
    const [
      user,
    ] = await connectionDB.query(
      `SELECT id, is_account_active FROM users WHERE id= ? AND is_account_active=1`,
      [_id]
    );
    user.length ? user[0] : 0;
  } catch (error) {
    const newToken = await checkToken(token);
    return newToken;
  }
}
