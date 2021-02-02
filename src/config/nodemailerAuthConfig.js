const { SERVICE_EMAIL, ADMIN_EMAIL, PASSWORD_ADMIN_EMAIL } = process.env;

const nodemailerAuthConfig = {
  service: SERVICE_EMAIL,
  pool: true,
  auth: {
    user: ADMIN_EMAIL,
    pass: PASSWORD_ADMIN_EMAIL,
  },
};

export default nodemailerAuthConfig;
