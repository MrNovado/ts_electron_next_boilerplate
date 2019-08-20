import { $ipc } from "@const/$ipc";
import { BrowserWindow } from "electron";
import { StoreAPI } from "@app/store";

export const initIPC = (window: BrowserWindow, storeAPI: StoreAPI) => {
  $ipc.RequestSomething.withMain.onNext((event, data) =>
    console.log(event, data, window, storeAPI)
  );
};
