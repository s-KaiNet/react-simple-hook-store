import { IStoreInternal, MethodsMap, StoreActions, UseStoreReturn } from "./types";
export declare const createStore: <S, A extends MethodsMap<A>>(initialState: S, actions: StoreActions<S, A>) => {
    useStore: UseStoreReturn<S, A>;
    store: IStoreInternal<S, A>;
};
export * from "./types";
