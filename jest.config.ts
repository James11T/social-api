import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  maxWorkers: 1,
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      isolatedModules: true
    }
  },
  forceExit: true
};

export default config;
