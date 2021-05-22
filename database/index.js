import config from "../api/config";
import mysql from "mysql2/promise";

let pool;

async function getConnection() {
	if (!pool) {
		pool = mysql.createPool(config.mysql);
	}
	return await pool.getConnection();
}

export default getConnection;
