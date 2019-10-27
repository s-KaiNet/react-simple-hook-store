import { DeepReadonly, DeepPartial } from "utility-types";
export interface IListener<T> {
    oldState: Partial<T>;
    run: (newState: any) => void;
}
export interface IStore<S, A> {
    state: DeepReadonly<S>;
    setState: (newState: DeepPartial<S>) => void;
    actions: A;
}
export interface IStoreInternal<S, A> extends IStore<S, A> {
    listeners: Array<IListener<S>>;
}
export declare type StoreActions<S, A> = {
    [P in keyof A]: A[P] extends (...p: infer U) => infer R ? (store: IStore<S, A>, ...p: U) => R : A[P] extends object ? StoreActions<S, A[P]> : never;
};
export declare type MethodsMap<A> = {
    [P in keyof A]: A[P] extends object ? MethodsMap<A[P]> : (...payload: any) => void;
};
export declare type UseStoreReturn<S, A> = (() => [S, A]) & (<NS>(stateFunc: (state: S) => NS) => [NS, A]) & (<NA>(stateFunc: undefined, actionsFunc: (actions: A) => NA) => [S, NA]) & (<NS, NA>(stateFunc: (state: S) => NS, actionsFunc: (actions: A) => NA) => [NS, NA]);
