import "dotenv/config";
import mongoose from "mongoose";
import ip from "ip";

import app from "./app";

const { PORT, DB_URL } = process.env;

console.log(`NODE_ENV = ${process.env.NODE_ENV}`);

mongoose.connect(DB_URL, () => {
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
