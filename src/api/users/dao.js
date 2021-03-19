// Data Access Object

import getConnection from "../../services/database";
import helpers from "../../helpers";
let connectionDB;

export default {
	find: async (request = {}, tableName) => {
		connectionDB = await getConnection();
		let sql = `SELECT * FROM ${tableName}`;
		let [requestQuery] = await connectionDB.query(sql);

		if (!Object.keys(request).length) {
			return requestQuery;
		}

		const { columnSet, values } = helpers.multipleColumnSet(request);
		sql += ` WHERE ${columnSet}`;

		return await connectionDB.query(sql, [...values]);
	},

	findOne: async (params, tableName) => {
		connectionDB = await getConnection();
		const { columnSet, values } = helpers.multipleColumnSet(params);

		const sql = `SELECT * FROM ${tableName}
        WHERE ${columnSet}`;

		const [result] = await connectionDB.query(sql, [...values]);
		return result[0];
	},
	create: async (user, tableName) => {
		connectionDB = await getConnection();

		const [result] = await connectionDB.query(
			`
			INSERT INTO ${tableName} SET ?`,
			[user],
		);

		const affectedRows = result ? result.affectedRows : 0;

		return affectedRows;
	},
};
