import { useState, useEffect, useMemo } from "react";
import { IStoreInternal, IListener, MethodsMap, StoreActions, UseStoreReturn, IStore } from "./types";
import { DeepReadonly, DeepPartial } from "utility-types";
import equal from "fast-deep-equal";

function setState<S, A>(store: IStoreInternal<S, A>, newState: DeepPartial<S>) {
  store.state = { ...store.state, ...newState };
  if (!store.inBatch) {
    store.listeners.forEach((listener) => {
      listener.run(store.state);
    });
  }
}

function runListeners<S, A>(store: IStoreInternal<S, A>) {
  store.listeners.forEach((listener) => {
    listener.run(store.state);
  });
}

function batchUpdates<S, A>(store: IStoreInternal<S, A>, callback: () => void) {
  try {
    store.inBatch = true;
    callback();
    runListeners(store);
  } finally {
    store.inBatch = false;
  }
}

function useStore<S, A>(
  store: IStoreInternal<S, A>,
  mapState: (state: DeepReadonly<S>) => any,
  mapActions?: (actions: A) => any) {
  const actions = useMemo(
    () => (mapActions ? mapActions(store.actions) : store.actions),
    [mapActions, store.actions],
  );

  if (!mapState) {
    return [undefined, actions];
  }
  const state = mapState(store.state);

  const [, originalHook] = useState(state);

  useEffect(() => {
    const listner: IListener<S> = { oldState: state } as IListener<S>;
    listner.run = mapState
      ? (newState) => {
        const mappedState = mapState(newState);
        if (!equal(mappedState, listner.oldState)) {
          listner.oldState = mappedState;
          originalHook(mappedState);
        }
      }
      : originalHook;
    store.listeners.push(listner);

    return () => {
      store.listeners = store.listeners.filter(
        (l) => l !== listner,
      );
    };
  }, []);

  return [state, actions];
}

function associateActions<S, A extends MethodsMap<A>>(store: IStoreInternal<S, A>, actions: StoreActions<S, A>) {
  const result: MethodsMap<any> = {};

  Object.keys(actions).forEach((key) => {
    if (typeof actions[key as keyof A] === "function") {
      const action = actions[key as keyof A] as (store: IStoreInternal<S, A>, ...p: any) => any;
      result[key] = action.bind(null, store);
    }
    if (typeof actions[key as keyof A] === "object") {
      result[key] = associateActions(store as any, actions[key as keyof A] as any);
    }
  });
  return result as A;
}

export const createStore = <S, A extends MethodsMap<A>>(initialState: S, actions: StoreActions<S, A>) => {
  if (typeof initialState !== "object") {
    throw new Error("Only objects are supported as state, e.g. { counter: 0 }");
  }
  const store: IStoreInternal<S, A> = {
    state: initialState,
    listeners: [],
  } as IStoreInternal<S, A>;

  store.setState = setState.bind(null, store);
  store.actions = associateActions(store, actions);

  return {
    useStore: useStore.bind(null, store) as UseStoreReturn<S, A>,
    batchUpdates: batchUpdates.bind(null, store) as (callback: () => void) => void,
    store: store as IStore<S, A>,
  };
};

export * from "./types";
