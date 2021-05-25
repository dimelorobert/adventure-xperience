import "dotenv/config";

const environment = process.env.NODE_ENV || "development";

const defaultConfig = {
	api: {
		host: process.env.HOST,
		port: process.env.FIRST_DEFAULT_PORT || process.env.SECOND_DEFAULT_PORT,
	},

	jwt: {
		secret_key: process.env.SECRET_KEY,
		expired_at: process.env.EXPIRATION_TOKEN,
	},
	nodemailer: {
		admin_email: process.env.ADMIN_EMAIL,
		password: process.env.PASSWORD_ADMIN_EMAIL,
		service: process.env.SERVICE_EMAIL,
		pool: process.env.POOL_NODEMAILER,
		auth: {
			user: process.env.ADMIN_EMAIL,
			pass: process.env.PASSWORD_ADMIN_EMAIL,
		},
	},
	mysql: {
		connectionLimit: process.env.MYSQL_CONNECTION_LIMITS,
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE,
		timezone: process.env.MYSQL_TIMEZONE,
	},
	pathFiles: {
		logo: process.env.LOGO_IMAGE_PATH,
		avatar: process.env.AVATAR_DEFAULT,
	},
};

let environmentConfig = {};

switch (environment) {
	case "desarrollo":
	case "dev":
	case "development":
		environmentConfig = require("./dev");
		break;
	case "produccion":
	case "prod":
	case "production":
		environmentConfig = require("./prod");
		break;
	case "stage":
	case "test":
		environmentConfig = require("./stage");
		break;
	default:
		environmentConfig = require("./dev");
}

const config = {
	...defaultConfig,
	...environmentConfig,
};

export default config;
