// tslint:disable: jsx-no-lambda
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import { createStore, StoreActions } from "../src";

describe("useStore", () => {
    interface IActions {
        increment: () => void;
    }

    interface IState {
        counter: number;
    }

    it("Should throw when a primitive used as store value", () => {
        const value = "my store value";
        expect(() => {
            createStore(value, {});
        }).toThrow();
    });

    it("Should re-render with valid number", (done) => {

        const actions: StoreActions<IState, IActions> = {
            increment: (store) => {
                store.setState({
                    counter: store.state.counter + 1,
                });
            },
        };

        const { useStore } = createStore({
            counter: 0,
        }, actions);

        const Component = () => {
            const [counter, increment] = useStore((s) => s.counter, (a) => a.increment);

            return (
                <button onClick={() => increment()}>
                    {counter}
                </button>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.text()).toBe("0");
            rendered.find("button").simulate("click");
            expect(rendered.text()).toBe("1");
            rendered.find("button").simulate("click");
            expect(rendered.text()).toBe("2");
            done();
        });
    });

    it("Should return full state object", (done) => {

        const { useStore } = createStore<IState, IActions>({
            counter: 1,
        }, {} as any);

        const Component = () => {
            const [state] = useStore();

            return (
                <div>{state.counter}</div>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.text()).toBe("1");
            done();
        });
    });

    it("Should return subset of state object", (done) => {

        const { useStore } = createStore<IState, IActions>({
            counter: 1,
        }, {} as any);

        const Component = () => {
            const [counter] = useStore((s) => s.counter);

            return (
                <div>{counter}</div>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.text()).toBe("1");
            done();
        });
    });

    it("Should return subset of state object and subset of actions", (done) => {

        const { useStore } = createStore<IState, IActions>({
            counter: 0,
        }, {
            increment: (store) => {
                store.setState({
                    counter: store.state.counter + 1,
                });
            },
        });

        const Component = () => {
            const [counter, increment] = useStore((s) => s.counter, (a) => a.increment);

            return (
                <button onClick={() => increment()}>
                    {counter}
                </button>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.text()).toBe("0");
            rendered.find("button").simulate("click");
            expect(rendered.text()).toBe("1");
            rendered.find("button").simulate("click");
            expect(rendered.text()).toBe("2");
            done();
        });
    });

    it("Should return full state object and subset of actions", (done) => {

        const { useStore } = createStore<IState, IActions>({
            counter: 0,
        }, {
            increment: (store) => {
                store.setState({
                    counter: store.state.counter + 1,
                });
            },
        });

        const Component = () => {
            const [state, increment] = useStore(undefined, (a) => a.increment);

            return (
                <button onClick={() => increment()}>
                    {state.counter}
                </button>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.text()).toBe("0");
            rendered.find("button").simulate("click");
            expect(rendered.text()).toBe("1");
            rendered.find("button").simulate("click");
            expect(rendered.text()).toBe("2");
            done();
        });
    });

    it("Should return subset state object and subset of actions using nested store", (done) => {
        const state = {
            appState: {
                counter: 0,
                text: "hello",
            },
            otherState: {
                counter: 1,
            },
        };

        interface ITestActions {
            appStateActions: {
                incrementAppStateCounter(): void;
            };
            otherStateActions: {
                incrementOtherStateCounter(): void;
            };
        }

        const { useStore } = createStore<typeof state, ITestActions>(state, {
            appStateActions: {
                incrementAppStateCounter(s) {
                    s.setState({
                        appState: {
                            counter: s.state.appState.counter + 1,
                        },
                    });
                },
            },
            otherStateActions: {
                incrementOtherStateCounter(s) {
                    s.setState({
                        otherState: {
                            counter: s.state.otherState.counter + 1,
                        },
                    });
                },
            },
        });

        const Component = () => {
            const [appState, appStateActions] = useStore((s) => s.appState, (a) => a.appStateActions);

            return (
                <button onClick={() => appStateActions.incrementAppStateCounter()}>
                    {appState.counter}
                </button>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.text()).toBe("0");
            rendered.find("button").simulate("click");
            expect(rendered.text()).toBe("1");
            rendered.find("button").simulate("click");
            expect(rendered.text()).toBe("2");
            done();
        });
    });

    it("Should not mess different nested states", (done) => {
        const state = {
            appState: {
                counter: 0,
                text: "hello",
            },
            otherState: {
                counter: 0,
            },
        };

        interface ITestActions {
            appStateActions: {
                incrementAppStateCounter(): void;
            };
            otherStateActions: {
                incrementOtherStateCounter(): void;
            };
        }

        const { useStore } = createStore<typeof state, ITestActions>(state, {
            appStateActions: {
                incrementAppStateCounter(s) {
                    s.setState({
                        appState: {
                            counter: s.state.appState.counter + 1,
                        },
                    });
                },
            },
            otherStateActions: {
                incrementOtherStateCounter(s) {
                    s.setState({
                        otherState: {
                            counter: s.state.otherState.counter + 1,
                        },
                    });
                },
            },
        });

        const Component = () => {
            const [globalState, appStateActions] = useStore(undefined, (a) => a.appStateActions);

            return (
                <>
                    <button onClick={() => appStateActions.incrementAppStateCounter()}>
                        {globalState.appState.counter}
                    </button>
                    <div>
                        {globalState.otherState.counter}
                    </div>
                </>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.find("button").text()).toBe("0");
            rendered.find("button").simulate("click");
            expect(rendered.find("button").text()).toBe("1");
            expect(rendered.find("div").text()).toBe("0");
            done();
        });
    });

    it("Should remove listener when component is unmounted", (done) => {

        const actions: StoreActions<IState, IActions> = {
            increment: (s) => {
                s.setState({
                    counter: s.state.counter + 1,
                });
            },
        };

        const { store, useStore } = createStore({
            counter: 0,
        }, actions);

        const Component = () => {
            const [counter, increment] = useStore((s) => s.counter, (a) => a.increment);

            return (
                <button onClick={() => increment()}>
                    {counter}
                </button>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.text()).toBe("0");
            rendered.unmount();
            expect(store.listeners.length).toBe(0);
            done();
        });
    });

    it("Should update component when state was modified outside", (done) => {

        const actions: StoreActions<IState, IActions> = {
            increment: (s) => {
                s.setState({
                    counter: s.state.counter + 1,
                });
            },
        };

        const { store, useStore } = createStore({
            counter: 0,
        }, actions);

        const Component = () => {
            const [counter, increment] = useStore((s) => s.counter, (a) => a.increment);

            return (
                <button onClick={() => increment()}>
                    {counter}
                </button>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.text()).toBe("0");
            act(() => {
                store.setState({
                    counter: 2,
                });
            });
            expect(rendered.text()).toBe("2");
            done();
        });
    });

    it("Should re-render component with async action", (done) => {

        interface ITestActions {
            increment: () => Promise<void>;
        }

        const { useStore } = createStore<IState, ITestActions>({
            counter: 0,
        }, {
            increment: async (store) => {
                return new Promise((resolve) => {
                    store.setState({
                        counter: store.state.counter + 1,
                    });
                    resolve();
                });
            },
        });

        const Component = () => {
            const [state, increment] = useStore(undefined, (a) => a.increment);

            return (
                <button onClick={async () => increment()}>
                    {state.counter}
                </button>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.text()).toBe("0");
            rendered.find("button").simulate("click");
            expect(rendered.text()).toBe("1");
            rendered.find("button").simulate("click");
            expect(rendered.text()).toBe("2");
            done();
        });
    });
});
