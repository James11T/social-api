import chalk from "chalk";

const stringify = (icon: string, ...args: string[]) =>
  `${icon} ${args.join(" ")}`;

const tick = (...args: string[]) => stringify(chalk.green("✓"), ...args);
const cross = (...args: string[]) => stringify(chalk.red("✗"), ...args);
const hourglass = (...args: string[]) => stringify(chalk.yellow("⧗"), ...args);
const hammer = (...args: string[]) => stringify(chalk.blue("⚒"), ...args);

const link = (url: string) => chalk.blue.underline(url);

const format = {
  success: tick,
  fail: cross,
  error: cross,
  waiting: hourglass,
  dev: hammer,
  build: hammer,
  link
};

export default format;
