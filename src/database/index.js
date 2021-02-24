import mysql from "mysql2/promise";

// import connection config to mysql
import { mysqlConfig } from "../config";

let pool;

async function getConnection() {
	if (!pool) {
		pool = mysql.createPool(mysqlConfig);
	}
	return await pool.getConnection();
}

export default getConnection;
