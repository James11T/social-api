import cors from "cors";
import helmet from "helmet";
import express from "express";
import baseRouter from "./routes";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.middleware";
import setRequestMeta from "./middleware/pre.middleware";
import { logRequest } from "./middleware/pre.middleware";

const app = express();

app.use;

app.use(setRequestMeta);
app.use(express.urlencoded({ extended: true })); // Parse forms
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(cors()); // Allow all cross-origin requests
app.use(helmet());
app.use(logRequest);

app.disable("x-powered-by"); // Disable X-Powered-By header

app.use("/api/v1", baseRouter);

app.use(errorHandler);

app.use("*", (req, res) => res.status(404).json({ error: "unknown route" }));

export default app;
