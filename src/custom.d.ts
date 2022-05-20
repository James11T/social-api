import { HydratedDocument } from "mongoose";
import { UserType } from "./schemas/user.schema";

declare global {
  namespace Express {
    interface Request {
      realIp: string;
      country: string;
    }

    interface User extends HydratedDocument<UserType> {}
  }
}

export {};
