import { createServer } from "http";
import { isAbsolute } from "path";
import { app } from "electron";
import { resolve } from "app-root-path";

const devServer = async (dir: string, port: number) => {
  const next = require("next")({ dev: true, dir });
  const requestHandler = next.getRequestHandler();

  await next.prepare();

  const server = createServer(requestHandler);
  server.listen(port || 8000, () => {
    app.on("before-quit", () => server.close());
  });
};

const adjustRenderer = (directory: string) => {
  return directory;
};

export default (directory: string, port: number, isDev: boolean) => {
  const absDirectory = !isAbsolute(directory) ? resolve(directory) : directory;
  if (isDev) {
    return devServer(absDirectory, port);
  } else {
    return adjustRenderer(absDirectory);
  }
};
