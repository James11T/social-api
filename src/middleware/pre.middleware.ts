import chalk from "chalk";
import { IPToCountry } from "../utils/ip";
import { colorizeHTTPCode } from "../utils/strings";
import { isDevelopmentEnv } from "../config";
import type { Request, Response, NextFunction } from "express";

const setRealIp = (req: Request, res: Response, next: NextFunction) => {
  let ip =
    req.header("x-real-ip") ?? req.header("cf-connecting-ip") ?? req.header("x-forwarded-for");

  if (isDevelopmentEnv && req.header("x-test-ip")) ip = ip ?? req.header("x-test-ip");

  req.realIp = ip ?? req.ip;
  next();
};

// Attempt to get the country code from the request IP address
const setRequestCountry = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.realIp;

  const countryCode = IPToCountry(ip);
  req.country = countryCode;

  next();
};

const ping = chalk.bold.white("Ping!");
const methods: { [key: string]: string } = {
  GET: chalk.bold.green("GET"),
  POST: chalk.bold.green("POST"),
  DELETE: chalk.bold.red("DELETE"),
  PUT: chalk.bold.yellow("PUT"),
  PATCH: chalk.bold.yellow("PATCH"),
};

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    const output = [
      ping,
      methods[req.method],
      req.realIp,
      req.originalUrl,
      "->",
      colorizeHTTPCode(res.statusCode),
    ];
    console.log(output.join(" "));
  });
  next();
};

const setRequestMeta = [setRealIp, setRequestCountry];

export { setRealIp, logRequest };
export default setRequestMeta;
