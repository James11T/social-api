import express from "express";
import cors from "cors";
import baseRouter from "./routes";

const app = express();

app.use(express.urlencoded({ extended: true })); // Parse forms
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Allow all cross-origin requests
app.disable("x-powered-by"); // Disable X-Powered-By header

app.use("/api/v1", baseRouter);

export default app;
