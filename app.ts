import express from "express";
import cors from "cors";
import * as cookieParser from "cookie-parser";
import router from "./router";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(router);

export default app;
