import { $ipc, isRenderer } from "@const/$ipc";
import { routs } from "@const/$routs";

import React, { useEffect } from "react";
import { Container } from "next/app";
import { useRouter } from "next/router";

import { createStore, Store } from "redux";
import { Provider } from "react-redux";

import { syncReducer, StoreStateRaw, Actions, serialize, deserialize } from "@redux/index";

enum StorageKeys {
  GLOBAL = "@@STORE",
  LOCAL = "@@STATE",
}

const isServer = typeof window === "undefined";
const GL: any & { [StorageKeys.GLOBAL]: Store<StoreStateRaw, Actions> } = global;

let store: Store<StoreStateRaw, Actions>;

if (isServer) {
  store = createStore(syncReducer);
} else {
  const rawState = sessionStorage.getItem(StorageKeys.LOCAL);
  const initial = rawState ? deserialize(JSON.parse(rawState)) : {};
  store = GL[StorageKeys.GLOBAL] || (GL[StorageKeys.GLOBAL] = createStore(syncReducer, initial));
}

if (isRenderer()) {
  $ipc.StateSync.withRenderer.removeAll();
  $ipc.StateSync.withRenderer.onNext((_, state) => {
    const globalState = deserialize(state);
    console.log("SYNC", globalState);
    store.dispatch({ type: "@@/SYNC", state: globalState });
  });
}

const MyApp = (props: { Component: any }) => {
  const { Component, ...pageProps } = props;

  const router = useRouter();
  const moveToPage = () => router.push(routs.page.href);

  useEffect(function handleOpenPageRequest() {
    $ipc.OpenPage.withRenderer.onNext(moveToPage);
    return () => {
      $ipc.OpenPage.withRenderer.remove(moveToPage);
    };
  }, []);

  useEffect(function localStoreState() {
    store.subscribe(() => {
      const state = store.getState();
      const rawState = serialize(state);
      sessionStorage.setItem(StorageKeys.LOCAL, JSON.stringify(rawState));
    });
  }, []);

  return (
    <Container>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </Container>
  );
};

export default MyApp;
