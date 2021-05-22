import userDao from "./dao";

export default {
	create: async (user, tableName) => {
		return await userDao.create(user, tableName);
	},
	findOne: async (id, tableName) => {
		return await userDao.findOne(id, tableName);
	},
};
