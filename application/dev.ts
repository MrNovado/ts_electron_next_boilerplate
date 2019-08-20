import * as isDev from "electron-is-dev";
import { configure, getLogger, Logger } from "log4js";

const logDev = isDev;

/**
 * LOGGER NAIVE IMPLEMENTATION
 */

enum L {
  DEFAULT = "default",
  STORE = "store",
}

export function configureLog4JS(unpackedPath: string) {
  const fileAppender = (l: L) => ({
    [l]: {
      type: "file",
      filename: `${unpackedPath}/logs/frontend-${l}.log`,
      // flag: w forces log4j to overwrite existing logs
      flags: "w",
    },
  });

  configure({
    appenders: {
      ...fileAppender(L.DEFAULT),
      ...fileAppender(L.STORE),
    },
    categories: {
      [L.DEFAULT]: { appenders: [L.DEFAULT], level: "debug" },
      [L.STORE]: { appenders: [L.STORE], level: "debug" },
    },
  });
}

type LogMsg = string | (() => string) | (() => object);
type LogMsgUnion = { prefix?: string } & (
  | { kind: "info"; info: LogMsg }
  | { kind: "debug"; debug: LogMsg }
  | { kind: "info-debug"; info: LogMsg; debug: LogMsg }
  | { kind: "warn"; warn: LogMsg }
  | { kind: "error"; error: LogMsg });

const LoggersRef = /**
 * Lazily (and only once each) aquires logger instances.
 * Stores those instances in its mutable state.
 * Does not modifies its state further in any way.
 */ (function createLoggersContainer() {
  const ref: { [key in L]: Logger | null } = {
    [L.DEFAULT]: null,
    [L.STORE]: null,
  };

  const getter = (loggerKey: L) => () => ref[loggerKey] || (ref[loggerKey] = getLogger(loggerKey));

  return {
    [L.DEFAULT]: getter(L.DEFAULT),
    [L.STORE]: getter(L.STORE),
  };
})();

// to suspend expensive calls
function unwrap(msg: LogMsg, prefix: string = ""): string {
  if (typeof msg === "string") {
    return `${prefix} ${msg}`;
  } else {
    const unwrapped = msg();
    if (typeof unwrapped === "string") {
      return `${prefix} ${unwrapped}`;
    } else {
      return `${prefix} ${JSON.stringify(unwrapped, null, 2)}`;
    }
  }
}

// expensive calls will be ignored in prod
function logWith(logger: Logger, Msg: LogMsgUnion) {
  switch (Msg.kind) {
    case "info": {
      logger.info(unwrap(Msg.info, Msg.prefix));
      return;
    }
    case "info-debug": {
      logDev
        ? logger.debug(unwrap(Msg.debug, Msg.prefix))
        : logger.info(unwrap(Msg.info, Msg.prefix));
      return;
    }
    case "debug": {
      logDev ? logger.debug(unwrap(Msg.debug, Msg.prefix)) : null;
      return;
    }
    case "warn": {
      logger.warn(unwrap(Msg.warn, Msg.prefix));
      return;
    }
    case "error": {
      logger.error(unwrap(Msg.error, Msg.prefix));
      return;
    }
  }
}

export function logStoreMsg(msg: LogMsgUnion) {
  const logger = LoggersRef[L.STORE]();
  logWith(logger, msg);
}

export function log(msg: LogMsgUnion) {
  const logger = LoggersRef[L.DEFAULT]();
  logWith(logger, msg);
}

/**
 * CHROME TOOLS EXTENSIONS
 */

export function tryDevExtensions() {
  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    } = require("electron-devtools-installer");

    return installExtension(REACT_DEVELOPER_TOOLS);
  }

  return false;
}
