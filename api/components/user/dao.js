// Data Access Object

import getConnection from "../../../database";
import helpers from "../../../utils/helpers";
let connectionDB;

function multipleColumnSet(object) {
	if (typeof object !== "object") {
		throw new Error("Invalid input");
	}

	const keys = Object.keys(object);
	const values = Object.values(object);

	let columnSet = keys.map(key => `${key} = ?`).join(", ");

	return {
		columnSet,
		values,
	};
}

module.exports = {
	findAll: async (request = {}, tableName) => {
		try {
			connectionDB = await getConnection();
			let sql = `SELECT * FROM ${tableName}`;
			let [requestQuery] = await connectionDB.query(sql);

			if (!Object.keys(request).length) {
				return requestQuery;
			}

			const { columnSet, values } = helpers.multipleColumnSet(request);
			sql += ` WHERE ${columnSet}`;

			return await connectionDB.query(sql, [...values]);
		} catch (error) {
			next(error);
		} finally {
			if (connectionDB) connectionDB.release();
		}
	},

	findOne: async (tableName, params) => {
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
	update: async (tableName, user, where) => {
		connectionDB = await getConnection();
		if (where === undefined || where === null) {
			const sql = `
			UPDATE ${tableName} SET ?`;

			const [result] = await connectionDB.query(sql, [user]);

			const affectedRows = result ? result.affectedRows : 0;

			return affectedRows;
		} else {
			const sql = `
			UPDATE ${tableName} SET ? WHERE ${where}=?`;

			const [result] = await connectionDB.query(sql, [user, where]);

			const affectedRows = result ? result.affectedRows : 0;

			return affectedRows;
		}
	},
};
