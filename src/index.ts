import "dotenv/config";
import express from "express";
import cors from "cors";
import baseRouter from "./routes";
import ip from "ip";

const { PORT } = process.env;

const app = express();

app.use(express.urlencoded({ extended: true })); // Parse forms
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Allow all cross-origin requests
app.disable("x-powered-by"); // Disable X-Powered-By header

app.use("/api/v1", baseRouter);

app.listen(PORT, () => {
  const localAddr = `http://localhost:${PORT}/`;
  const remoteAddr = `http://${ip.address()}:${PORT}/`;
  console.log(
    `\nServer is running on port \x1b[35m${PORT}\n`,
    `Connect locally with \x1b[34m\x1b[4m${localAddr}\n`,
    `Or on another device with \x1b[34m\x1b[4m${remoteAddr}\n`
  );
});
