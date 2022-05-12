declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DB_URL: string;
      NODE_ENV: string | undefined;
    }
  }
}

export {};
