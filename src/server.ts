import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import mongoose from "mongoose";

const { DB_HOST, PORT } = process.env;

// connectToDB().then(() => {
//   app.listen(PORT, () => {
//     console.log("start dev");
//   });
// });

mongoose.connect(DB_HOST!).then(() => {
  try {
    app.listen(PORT, () => console.log("start dev"));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
