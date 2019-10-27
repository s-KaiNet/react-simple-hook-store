// tslint:disable: jsx-no-lambda
import React from "react";
import { mount } from "enzyme";
import { createStore, StoreActions } from "../src";

describe("useStore", () => {

    it("Should throw when a primitive used as store value", () => {
        const value = "my store value";
        expect(() => {
            createStore(value, {});
        }).toThrow();
    });

    it("Should re-render with valid number when state is a primitive", (done) => {
        interface IActions {
            increment: () => void;
        }

        interface IState {
            counter: number;
        }

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
});
