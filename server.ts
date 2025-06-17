import app from "./app";
import dotenv from "dotenv";
import { connectToDB } from "./db.config";
dotenv.config();

connectToDB().then(() => {
  app.listen(process.env.PORT!, () => {
    console.log("start dev");
  });
});
