import chalk from "chalk";
import geoip from "geoip-country";
import { colorizeHTTPCode } from "../utils/strings";
import type { Request, Response, NextFunction } from "express";

const FAIL_COUNTRY_CODE = "ZZ";

const setRealIp = (req: Request, res: Response, next: NextFunction) => {
  let ip = req.header("x-real-ip") ?? req.header("cf-connecting-ip") ?? req.header("x-forwarded-for");

  req.realIp = ip ?? req.ip;
  next();
};

// Attempt to get the country code from the request IP address
const setRequestCountry = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.realIp;

  if (!ip) {
    req.country = FAIL_COUNTRY_CODE;
    return next();
  }

  let country;
  try {
    const geoData = geoip.lookup(ip);

    if (!geoData) throw new Error("No geo data for IP");
    req.country = geoData.country;
  } catch (err) {
    country = FAIL_COUNTRY_CODE;
  }

  next();
};

const ping = chalk.bold.white("Ping!");
const methods: { [key: string]: string } = {
  GET: chalk.bold.green("GET"),
  POST: chalk.bold.green("POST"),
  DELETE: chalk.bold.red("DELETE"),
  PUT: chalk.bold.yellow("PUT"),
  PATCH: chalk.bold.yellow("PATCH")
};
const logRequest = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    const output = [ping, methods[req.method], req.realIp, req.originalUrl, "->", colorizeHTTPCode(res.statusCode)];
    console.log(output.join(" "));
  });
  next();
};

const setRequestMeta = [setRealIp, setRequestCountry];

export { setRealIp, logRequest };
export default setRequestMeta;
