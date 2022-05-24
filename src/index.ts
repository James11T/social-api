import "dotenv/config";
import mongoose from "mongoose";
import ip from "ip";
import app from "./app";
import { RUNTIME_CONSTANTS } from "./constants";

const { PORT, DB_URL } = process.env;

if (RUNTIME_CONSTANTS.IS_DEV) {
  console.log("Running in development mode");
}

mongoose.connect(DB_URL, (error) => {
  if (error) {
    console.error("Failed to connect to MongoDB", error);
    return;
  }

  console.log(`Connected to MongoDB`);

  app.listen(PORT, () => {
    const localAddr = `http://localhost:${PORT}/`;
    const remoteAddr = `http://${ip.address()}:${PORT}/`;
    console.log(
      `\nServer is running on port ${PORT}\n`,
      `Connect locally with ${localAddr}\n`,
      `Or on another device with ${remoteAddr}\n`
    );
  });
});
