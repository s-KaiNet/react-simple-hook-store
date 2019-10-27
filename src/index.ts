import { useState, useEffect, useMemo } from "react";
import { IStore, IListener, MethodsMap, StoreActions, UseStoreReturn } from "./types";
import { DeepReadonly } from "utility-types";

function setState<S, A>(store: IStore<S, A>, newState: Partial<S>) {
  store.state = { ...store.state, ...newState };
  store.listeners.forEach((listener) => {
    listener.run(store.state);
  });
}

function useStore<S, A>(
  store: IStore<S, A>,
  mapState: (state: DeepReadonly<S>) => any,
  mapActions: (actions: A) => any) {
  const state = mapState ? mapState(store.state) : store.state;
  const actions = useMemo(
    () => (mapActions ? mapActions(store.actions) : store.actions),
    [mapActions, store.actions],
  );

  const [, originalHook] = useState(state);

  useEffect(() => {
    const newListener: IListener<S> = { oldState: state } as IListener<S>;
    newListener.run = mapState
      ? (newState) => {
        const mappedState = mapState(newState);
        if (mappedState !== newListener.oldState) {
          newListener.oldState = mappedState;
          originalHook(mappedState);
        }
      }
      : originalHook;
    store.listeners.push(newListener);

    return () => {
      store.listeners = store.listeners.filter(
        (listener) => listener !== newListener,
      );
    };
  }, []);

  return [state, actions];
}

function associateActions<S, A extends MethodsMap<A>>(store: IStore<S, A>, actions: StoreActions<S, A>) {
  const result: MethodsMap<any> = {};

  Object.keys(actions).forEach((key) => {
    if (typeof actions[key as keyof A] === "function") {
      const action = actions[key as keyof A] as (store: IStore<S, A>, ...p: any) => any;
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
  const store: IStore<S, A> = {
    state: initialState,
    listeners: [],
  } as IStore<S, A>;

  store.setState = setState.bind(null, store);
  store.actions = associateActions(store, actions);

  return {
    useStore: useStore.bind(null, store) as UseStoreReturn<S, A>,
    store,
  };
};

export * from "./types";
