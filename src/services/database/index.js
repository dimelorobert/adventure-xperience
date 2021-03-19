import mysql from "mysql2/promise";
import config from "../../config";

let pool;

async function getConnection() {
	if (!pool) {
		pool = mysql.createPool(config.mysql);
	}
	return await pool.getConnection();
}

export default getConnection;
