export default {
	mysql: {
		connectionLimit: process.env.MYSQL_CONNECTION_LIMITS,
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE,
		timezone: process.env.MYSQL_TIMEZONE,
	},
	nodemailer: {
		service: process.env.SERVICE_EMAIL,
		pool: process.env.POOL_NODEMAILER,
		auth: {
			user: process.env.ADMIN_EMAIL,
			pass: process.env.PASSWORD_ADMIN_EMAIL,
		},
	},
};
