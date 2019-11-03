// tslint:disable: jsx-no-lambda
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import { createStore, StoreActions } from "../src";

// tslint:disable-next-line: no-console
const consoleError = console.error;
beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation((...args) => {
        if (!args[0].includes("Warning: An update to %s inside a test was not wrapped in act")) {
            consoleError(...args);
        }
    });
});

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
            const [state] = useStore((s) => s);

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

    it("Should return undefined as state object", (done) => {

        const { useStore } = createStore<IState, IActions>({
            counter: 1,
        }, {} as any);

        const Component = () => {
            const [state] = useStore();
            const toRender = typeof state === "undefined";
            return (
                <div>{toRender.toString()}</div>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.text()).toBe("true");
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
            const toRender = typeof state === "undefined";
            return (
                <button onClick={() => increment()}>
                    {toRender.toString()}
                </button>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            expect(rendered.text()).toBe("true");
            rendered.find("button").simulate("click");
            expect(rendered.text()).toBe("true");
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
            const [globalState, appStateActions] = useStore((s) => s, (a) => a.appStateActions);

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
            const [state, increment] = useStore((s) => s, (a) => a.increment);

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

    it("Should not call render if state isn't in use insde a component", (done) => {

        const { useStore } = createStore<IState, IActions>({
            counter: 0,
        }, {
            increment: (store) => {
                store.setState({
                    counter: store.state.counter + 1,
                });
            },
        });

        let renderCount = 0;

        const Component = () => {
            const [, increment] = useStore(undefined, (a) => a.increment);

            renderCount++;

            return (
                <button onClick={() => increment()}>
                    Test
                </button>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            rendered.find("button").simulate("click");
            expect(renderCount).toBe(1);
            done();
        });
    });

    it("Should render multiple times without a batch", (done) => {
        const myState = {
            counter1: 0,
            counter2: 0,
            counter3: 0,
        };
        interface ITestActions {
            increment: () => Promise<void>;
        }
        const { useStore } = createStore<typeof myState, ITestActions>(myState, {
            increment: async (store) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        store.setState({
                            counter1: store.state.counter1 + 1,
                        });
                        store.setState({
                            counter2: store.state.counter2 + 1,
                        });
                        store.setState({
                            counter3: store.state.counter3 + 1,
                        });
                        resolve();
                    }, 10);
                });

            },
        });

        let renderCount = 0;

        const Component = () => {
            const [, increment] = useStore((s) => s, (a) => a.increment);

            renderCount++;

            return (
                <button onClick={async () => increment()}>
                    Test
                </button>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            rendered.find("button").simulate("click");
            setTimeout(() => {
                expect(renderCount).toBe(4);
                done();
            }, 20);
        });
    });

    it("Should call render once when used batch", (done) => {
        const myState = {
            counter1: 0,
            counter2: 0,
            counter3: 0,
        };
        interface ITestActions {
            increment: () => Promise<void>;
        }
        const { useStore, batchUpdates } = createStore<typeof myState, ITestActions>(myState, {
            increment: async (store) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        batchUpdates(() => {
                            store.setState({
                                counter1: store.state.counter1 + 1,
                            });
                            store.setState({
                                counter2: store.state.counter2 + 1,
                            });
                            store.setState({
                                counter3: store.state.counter3 + 1,
                            });
                        });
                        resolve();
                    }, 10);
                });

            },
        });

        let renderCount = 0;

        const Component = () => {
            const [, increment] = useStore((s) => s, (a) => a.increment);

            renderCount++;

            return (
                <button onClick={async () => increment()}>
                    Test
                </button>
            );
        };

        const rendered = mount(<Component />);

        requestAnimationFrame(() => {
            rendered.find("button").simulate("click");
            setTimeout(() => {
                expect(renderCount).toBe(2);
                done();
            }, 20);
        });
    });
});
