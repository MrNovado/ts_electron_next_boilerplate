import { app, dialog, BrowserWindow } from "electron";
import * as isDev from "electron-is-dev";
import * as path from "path";

import prepareNext from "@app/next";

import { initIPC } from "@app/ipc";
import { initStore } from "@app/store";
import { tryDevExtensions, configureLog4JS } from "@app/dev";

const nextPort = 8000;
const mainPage = "index";

function getDevPath(page: string, nextPort: number) {
  return `http://localhost:${nextPort}/${page}`;
}

function getProd(page: string) {
  return `./renderer/${page}.html`;
}

app.on("ready", async () => {
  // CONFIGURE CRITICAL EXCEPTION HANDLER
  initCriticalExceptionHandler();

  // CHECKING DEVTOOLS EXTENSIONS
  await tryDevExtensions();

  const appPath = app.getAppPath();
  const unpackedPath = isDev ? appPath : path.join(appPath, "../../");

  // CONFIGURE LOGGER
  configureLog4JS(unpackedPath);

  // PREPARING RENDERER
  await prepareNext("./renderer", nextPort, isDev);

  // INITIALIZING WINDOW
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // INITIALIZING STORE
  const storeAPI = initStore(window);

  // INITIALIZING IPCs
  initIPC(window, storeAPI);

  // RENDER
  {
    window.webContents.openDevTools();

    if (isDev) {
      const url = getDevPath(mainPage, nextPort);
      return window.loadURL(url);
    } else {
      const uri = getProd(mainPage);
      return window.loadFile(uri);
    }
  }
});

function initCriticalExceptionHandler() {
  process.on("uncaughtException", err => {
    dialog.showErrorBox(
      "Critical Error!",
      `Sorry, have to restart!\n\n ${err.stack}`
    );
    app.relaunch();
    app.exit(0);
    throw err;
  });
}
