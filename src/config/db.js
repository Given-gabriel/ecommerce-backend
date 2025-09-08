import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", true);

export async function connectDB() {
  const url = process.env.MONGO_URI;
  if (!url) throw new Error("MONGO_URI is missing");

  mongoose.connection.on("connected", () =>
    console.log("Connected to mongoDB")
  );
  mongoose.connection.on("error", (err) =>
    console.log("MongoDB error connecting")
  );
  mongoose.connection.on("disconnected", () =>
    console.warn("MongoDB disconnected")
  );

  await mongoose.connect(url, { autoIndex: true });
}
