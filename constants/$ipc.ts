import { ipcRenderer, ipcMain, Event as ElectronEvent, IpcRenderer, IpcMain } from "electron";
import { StoreStateRaw } from "@redux/index";

type IpcON<D> = {
  onNext: (callback: (event: ElectronEvent, data: D) => void) => void;
  remove: (callback: (event: ElectronEvent, data: D) => void) => void;
  removeAll: () => void;
};

function ON<D>(channel: string, ipc: IpcRenderer | IpcMain): IpcON<D> {
  return {
    onNext(callback: (event: ElectronEvent, data: D) => void) {
      ipc.on(channel, callback);
    },
    remove(callback: (event: ElectronEvent, data: D) => void) {
      ipc.removeListener(channel, callback);
    },
    removeAll() {
      ipc.removeAllListeners(channel);
    },
  };
}

type IpcSend<D> = {
  send: (data: D) => void;
};

function send<D>(channel: string): IpcSend<D> {
  return {
    send: (data: D) => ipcRenderer.send(channel, data),
  };
}

type IpcMainSend<D> = {
  send: (web: Electron.WebContents, data: D) => void;
};

function MAIN_SEND<D>(channel: string): IpcMainSend<D> {
  return {
    send(web: Electron.WebContents, data: D) {
      web.send(channel, data);
    },
  };
}

type FromRenderer<D> = {
  withRenderer: IpcSend<D>;
  withMain: IpcON<D>;
};

function fromRenderer<D>(channel: string): FromRenderer<D> {
  return {
    withRenderer: send<D>(channel),
    withMain: ON<D>(channel, ipcMain),
  };
}

type FromMain<D> = {
  withRenderer: IpcON<D>;
  withMain: IpcMainSend<D>;
};

function fromMain<D>(channel: string): FromMain<D> {
  return {
    withRenderer: ON<D>(channel, ipcRenderer),
    withMain: MAIN_SEND<D>(channel),
  };
}

type IpcScheme = {
  RequestSomething: FromRenderer<undefined>;
  OpenPage: FromMain<undefined>;
  StateSync: FromMain<StoreStateRaw>;
};

export const $ipc: IpcScheme = {
  RequestSomething: fromRenderer("request-something-example"),
  OpenPage: fromMain("open-page-example"),
  StateSync: fromMain("SYNC"),
};

export const isRenderer = () => Boolean(ipcRenderer);
export type ElectronEvent = ElectronEvent;
