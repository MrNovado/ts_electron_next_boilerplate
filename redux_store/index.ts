import { combineReducers, AnyAction, Reducer } from "redux";

interface SetLoaded extends AnyAction {
  type: "@@/loading/SET_LOADED";
  value: true;
}

interface Sync extends AnyAction {
  type: "@@/SYNC";
  state: StoreState;
}

export type Actions = Sync | SetLoaded;

export interface StoreState {
  loaded: boolean;
}

export interface StoreStateRaw {
  loaded: boolean;
}

export const serialize = (state: StoreState): StoreStateRaw => ({
  loaded: state.loaded,
});

export const deserialize = (raw: StoreStateRaw): StoreState => ({
  loaded: raw.loaded,
});

// prettier-ignore
export const localReducers = combineReducers<StoreState, Actions>({
  loaded: (state = false, action) =>
    action.type === "@@/loading/SET_LOADED"
      ? true
      : state,
});

export const syncReducer: Reducer<StoreState, Actions> = (state, action) => {
  if (action.type === "@@/SYNC") {
    return action.state;
  } else {
    return localReducers(state, action);
  }
};
