import mongoose from "mongoose";

export const connectToDB = async () => {
  const { DB_HOST } = process.env;
  try {
    await mongoose.connect(DB_HOST!).then(() => {
      console.log("connected");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
