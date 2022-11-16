import type { User } from "./models";

declare global {
  namespace Express {
    interface Request {
      realIp: string;
      country: string;
      user?: User;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_URL: string;
      NODE_ENV: string;
      SEND_EMAILS_IN_DEV: string;
      JWT_SECRET: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      AWS_S3_IMAGE_BUCKET: string;
    }
  }
}

export {};
