import { createStore } from "../src";

describe("store", () => {
    it("Should init store with provided value", () => {
        const initial = {
            counter: 0,
        };

        const { store } = createStore(initial, {});

        expect(initial).toStrictEqual(store.state);
    });

    it("Should update state with correct value", () => {
        const initial = {
            counter: 0,
        };

        const { store } = createStore(initial, {});
        store.setState({
            counter: 1,
        });

        expect(1).toStrictEqual(store.state.counter);
    });

    it("Should update state with action method", () => {
        const initial = {
            counter: 0,
        };

        interface IActions {
            set(value: number): void;
        }

        const { store } = createStore<typeof initial, IActions>(initial, {
            set: (s, value) => {
                s.setState({
                    counter: value,
                });
            },
        });
        store.actions.set(2);

        expect(2).toStrictEqual(store.state.counter);
    });

    it("Should update state with nested structure", () => {
        const initial = {
            appState: {
                counter: 0,
            },
        };

        interface IActions {
            set(value: number): void;
        }

        const { store } = createStore<typeof initial, IActions>(initial, {
            set: (s, value) => {
                s.setState({
                    appState: {
                        counter: value,
                    },
                });
            },
        });

        store.actions.set(2);

        expect(2).toStrictEqual(store.state.appState.counter);
    });

    it("Should set state outside of an action", () => {
        const initial = {
            counter: 0,
        };

        const { store } = createStore(initial, {});

        store.setState({
            counter: 2,
        });

        expect(2).toStrictEqual(store.state.counter);
    });

    it("Should not touch nested states", () => {
        const initial = {
            appState: {
                counter: 0,
            },
            otherState: {
                counter: 0,
            },
        };

        const { store } = createStore(initial, {});

        store.setState({
            appState: {
                counter: 1,
            },
        });

        expect(0).toStrictEqual(store.state.otherState.counter);
    });

    it("Should update state with async action method", async () => {
        const initial = {
            counter: 0,
        };

        interface IActions {
            set(value: number): Promise<void>;
        }

        const { store } = createStore<typeof initial, IActions>(initial, {
            set: async (s, value) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        s.setState({
                            counter: value,
                        });
                        resolve();
                    }, 100);
                });
            },
        });

        await store.actions.set(2);

        expect(2).toStrictEqual(store.state.counter);
    });
});
