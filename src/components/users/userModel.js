import getConnection from "../../database";
import helpers from "../../helpers";
let connectionDB;
let tableName = "users";

const userModel = {
	multipleColumnSet: object => {
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
	},

	find: async (request = {}) => {
		try {
			connectionDB = await getConnection();
			let sql = `SELECT * FROM ${tableName}`;
         let [requestQuery] = await connectionDB.query(sql);
         if (!requestQuery.length) {
            helpers.errorGenerator("Ha ocurrido un error en el servidor", 500);
         }

			if (!Object.keys(request).length) {
				return requestQuery;
			}

			const { columnSet, values } = this.multipleColumnSet(request);
			sql += ` WHERE ${columnSet}`;

			return await connectionDB.query(sql, [...values]);
		} catch (error) {
			console.error("La cagaste nene");
		} finally {
			if (connectionDB) {
				await connectionDB.release();
			}
		}
	},
};
export default userModel;
