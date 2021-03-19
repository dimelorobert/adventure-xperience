import path from "path";
import express from "express";
import router from "./routes";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import cors from "cors";
import "./services/database";
import "dotenv/";

const app = express();

// APPLICATION CONFIG
app.use(morgan("dev"))

	.use(cors())

	.use(fileUpload())

	.use(express.json())

	.use(express.urlencoded({ extended: false }))

	.use(express.static(path.join(__dirname, "public")))

	.use("/api/v1", router);

export default app;
