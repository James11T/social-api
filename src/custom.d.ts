import { User as APIUser } from "./schemas/user.schema";

declare global {
  namespace Express {
    interface Request {
      realIp: string;
      country: string;
    }

    interface User extends APIUser {}
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
