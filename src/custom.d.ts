import { UserType } from "./schemas/user.schema";

declare global {
  namespace Express {
    interface Request {
      realIp: string;
    }

    interface User extends UserType {}
  }
}

export {};
