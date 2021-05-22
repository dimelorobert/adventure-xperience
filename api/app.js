import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import path from "path";
import router from "../routes";

const app = express();

// APPLICATION CONFIG
app.use(morgan("dev"))

	.use(cors())

	.use(fileUpload())

	.use(express.json())

	.use(express.urlencoded({ extended: true }))

	.use(express.static(path.join(__dirname, "public")))

	.use("/", router);

export default app;
