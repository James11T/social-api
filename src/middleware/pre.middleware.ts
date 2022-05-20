import { RUNTIME_CONSTANTS } from "../constants";
import geoip from "geoip-country";
import type { Request, Response, NextFunction } from "express";

const FAIL_COUNTRY_CODE = "ZZ";

const setRealIp = (req: Request, res: Response, next: NextFunction) => {
  let ip = req.ip;

  if (!RUNTIME_CONSTANTS.IS_DEV) {
    ip = String(
      req.headers["x-real-ip"] || req.headers["cf-connecting-ip"] || ip
    );
  }

  req.realIp = ip;
  next();
};

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

const setRequestMeta = [setRequestCountry, setRealIp];

export { setRealIp };
export default setRequestMeta;
