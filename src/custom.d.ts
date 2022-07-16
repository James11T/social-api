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

  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_URL: string;
      NODE_ENV: string;
      SEND_EMAILS_IN_DEV: string;
    }
  }
}

export {};
