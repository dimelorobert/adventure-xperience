import Sequelize from "sequelize";
import "dotenv/config";

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

const sqlConnection = new Sequelize(
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  {
    host: MYSQL_HOST,
    dialect: "mysql",
    port: MYSQL_PORT,
    define: {
      timestamps: false,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idel: 10000,
    },
  }
);

export default sqlConnection;
