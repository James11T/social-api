import { RUNTIME_CONSTANTS } from "../constants";
import type { Request, Response, NextFunction } from "express";

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

export { setRealIp };
