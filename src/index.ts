import "dotenv/config";
import ip from "ip";
import chalk from "chalk";
import app from "./app";
import { initializeDatabase } from "./database";
import { RUNTIME_CONSTANTS } from "./config";
import format from "./utils/console";

const { PORT } = process.env;

const requiredEnvVars = [
  "PORT",
  "SESSION_SECRET",
  "JWT_SECRET",
  "DB_DIALECT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_DATABASE",
  "WEB_DOMAIN",
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_IMAGE_BUCKET",
  "AWS_COGNITO_CLIENT_ID"
];

const anyMissing = requiredEnvVars.some((envVar) => {
  if (!process.env[envVar]) {
    console.error(format.fail(`Required environment variable ${chalk.bold(envVar)} is not set.`));
    return true;
  }
});

if (anyMissing) process.exit(0);

const start = async () => {
  console.log(format.waiting("Starting..."));
  if (RUNTIME_CONSTANTS.IS_DEV) console.log(format.dev("Running in development mode"));

  const initDbResult = await initializeDatabase();

  if (initDbResult.err) {
    console.error(format.fail("Failed to connect to database"));
    process.exit();
  }

  console.log(format.success("Connected to database"));

  app.listen(PORT, () => {
    const localAddr = `http://localhost:${PORT}/`;
    const remoteAddr = `http://${ip.address()}:${PORT}/`;

    console.log(`\n${chalk.green("●")} Server is running on port ${chalk.blue.bold(PORT)}`);
    console.log(`   Connect locally with ${format.link(localAddr)}`);
    console.log(`   Or on another device with ${format.link(remoteAddr)}`);
  });
};

start();
