import React, { useState } from "react";
import { shallow, mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { createStore } from "../src";

describe("useStore", () => {
    const { useStore } = createStore("store", {});

    test("Renders valid text", (done) => {

        const HelloWorld = () => {
          const [name] = useStore();

          return (
            <div>Hello, {name}!</div>
          );
        };

        const rendered = mount(<HelloWorld />);

        requestAnimationFrame(() => {
          expect(rendered.text()).toBe("Hello, store!");
          done();
        });
      });
});
