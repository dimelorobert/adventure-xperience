import path from "path";
import express from "express";
import router from "./routes";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import cors from "cors";
import "./database";
import "dotenv/config";

const app = express();

// APPLICATION CONFIG
app.use(morgan("dev"))

	.use(cors())

	.use(fileUpload())

	.use(express.json())

	.use(express.urlencoded({ extended: false }))

	.use(express.static(path.join(__dirname, "public")))

	.use("/", router);

export default app;
