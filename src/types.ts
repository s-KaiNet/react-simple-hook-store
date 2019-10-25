export interface IListener<T> {
    oldState: Partial<T>;
    run: (newState: any) => void;
}

export interface IStore<S, A> {
    state: S;
    setState: (newState: Partial<S>) => void;
    actions: A;
    listeners: Array<IListener<S>>;
}

export type AddStoreParameter<S, A> = {
    [P in keyof A]: A[P] extends (...p: infer U) => infer R
    ? (store: IStore<S, A>, ...p: U) => R
    : A[P] extends object
    ? AddStoreParameter<S, A[P]>
    : never;
};

export type MethodsMap<A> = {
    [P in keyof A]: A[P] extends object
    ? MethodsMap<A[P]>
    : Record<keyof A, (...payload: any) => void>
};

export type UseStoreReturn<S, A> = (() => [S, A]) &
    (<NS>(stateFunc: (state: S) => NS) => [NS, A]) &
    (<NA>(stateFunc: undefined, actionsFunc: (actions: A) => NA) => [S, NA]) &
    (<NS, NA>(stateFunc: (state: S) => NS, actionsFunc: (actions: A) => NA) => [NS, NA]);
