import { MethodsMap, StoreActions, UseStoreReturn, IStore } from "./types";
export declare const createStore: <S, A extends MethodsMap<A>>(initialState: S, actions: StoreActions<S, A>) => {
    useStore: UseStoreReturn<S, A>;
    batchUpdates: (callback: () => void) => void;
    store: IStore<S, A>;
};
export * from "./types";
