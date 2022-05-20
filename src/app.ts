import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import { verify } from "./auth/password";
import baseRouter from "./routes";
import errorHandler from "./middleware/error.middleware";
import setRequestMeta from "./middleware/pre.middleware";

import "./auth/session";

const { SESSION_SECRET } = process.env;

const app = express();

app.use(setRequestMeta);
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
  })
);
app.use(express.urlencoded({ extended: true })); // Parse forms
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(cors()); // Allow all cross-origin requests

app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Initialize Passport sessions

app.disable("x-powered-by"); // Disable X-Powered-By header

passport.use(
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "userId" },
    verify
  )
);

app.use("/api/v1", baseRouter);

app.use(errorHandler);

export default app;
