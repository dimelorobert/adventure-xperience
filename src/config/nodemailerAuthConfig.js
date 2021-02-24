
const {
	SERVICE_EMAIL,
	ADMIN_EMAIL,
	PASSWORD_ADMIN_EMAIL,
	POOL_NODEMAILER,
} = process.env;

export default {
	service: SERVICE_EMAIL,
	pool: POOL_NODEMAILER,
	auth: {
		user: ADMIN_EMAIL,
		pass: PASSWORD_ADMIN_EMAIL,
	},
};
