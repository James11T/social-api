import "dotenv/config";
import ip from "ip";

import app from "./app";

const { PORT } = process.env;

app.listen(PORT, () => {
  const localAddr = `http://localhost:${PORT}/`;
  const remoteAddr = `http://${ip.address()}:${PORT}/`;
  console.log(
    `\nServer is running on port ${PORT}\n`,
    `Connect locally with ${localAddr}\n`,
    `Or on another device with ${remoteAddr}\n`
  );
});
