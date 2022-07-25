import "dotenv/config";
import mongoose from "mongoose";
import ip from "ip";
import chalk from "chalk";
import app from "./app";
import { RUNTIME_CONSTANTS } from "./config";

const { PORT, DB_URL } = process.env;

if (RUNTIME_CONSTANTS.IS_DEV) {
  console.log(`${chalk.blue("⚒")} Running in development mode`);
}

console.log(`${chalk.yellow("⧗")} Starting`);

const link = chalk.blue.underline;
const success = chalk.green("✓");
const fail = chalk.red("✗");

mongoose.connect(DB_URL, (error) => {
  const mongo = chalk.bold.green("MongoDB");
  if (error) {
    console.error(`${fail} Failed to connect to ${mongo}`, error);
    return;
  }

  console.log(`${success} Connected to ${mongo}`);

  app.listen(PORT, () => {
    const localAddr = `http://localhost:${PORT}/`;
    const remoteAddr = `http://${ip.address()}:${PORT}/`;

    console.log(
      `\n${chalk.green("●")} Server is running on port ${chalk.blue.bold(PORT)}`
    );
    console.log(`   Connect locally with ${link(localAddr)}`);
    console.log(`   Or on another device with ${link(remoteAddr)}`);
  });
});
