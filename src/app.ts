import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // changed from * import
import router from "./router";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(router);

export default app;
