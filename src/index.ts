import "dotenv/config";
import ip from "ip";
import chalk from "chalk";
import app from "./app";
import db from "./db";
import { RUNTIME_CONSTANTS } from "./config";

const { PORT } = process.env;
const link = chalk.blue.underline;

const start = async () => {
  console.log(`${chalk.yellow("⧗")} Starting`);

  if (RUNTIME_CONSTANTS.IS_DEV)
    console.log(`${chalk.blue("⚒")} Running in development mode`);

  try {
    db.authenticate();
    console.log(`${chalk.green("✓")} Connected to database`);
  } catch (error) {
    console.log(`${chalk.red("✗")} Failed to connect to database`);
    console.error(error);
    process.exit(1);
  }

  db.sync({ force: true });

  app.listen(PORT, () => {
    const localAddr = `http://localhost:${PORT}/`;
    const remoteAddr = `http://${ip.address()}:${PORT}/`;

    console.log(
      `\n${chalk.green("●")} Server is running on port ${chalk.blue.bold(PORT)}`
    );
    console.log(`   Connect locally with ${link(localAddr)}`);
    console.log(`   Or on another device with ${link(remoteAddr)}`);
  });
};

start();
