import { BrowserWindow } from "electron";
import { createStore, Store } from "redux";
import { localReducers, StoreStateRaw, Actions, serialize } from "@redux/index";
import { logStoreMsg } from "@app/dev";
import { $ipc } from "@const/$ipc";

export type StoreAPI = {
  getState: () => StoreStateRaw;
  dispatch: (action?: Actions, ...rest: Actions[]) => void;
};

export function initStore(win: BrowserWindow): StoreAPI {
  const store: Store<StoreStateRaw, Actions> = createStore(localReducers);

  store.subscribe(() => {
    const state = store.getState();
    $ipc.StateSync.withMain.send(win.webContents, serialize(state));
  });

  return {
    getState() {
      return store.getState();
    },
    dispatch(action?: Actions, ...rest: Actions[]) {
      [action, ...rest].forEach(a => {
        if (a !== undefined) {
          store.dispatch(a);
          logStoreMsg({
            kind: "info-debug",
            info: a.type,
            debug: () => a,
          });
        }
      });
    },
  };
}
