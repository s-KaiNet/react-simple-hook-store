import React from "react";
import { render } from "react-dom";

import App from "./App";

import { createStore } from "../src/index";

const store = createStore(null, {});

render(<App />, document.getElementById("app"));

/*
interface IMyState {
    data: string;
    val: number;
}

interface IActions {
    do1: (p1: string, p2: number) => void;
    do2: (p1: string) => void;
    nms: {
        do3: (p1: number, p2: string, p3: Date) => void;
        nms2: {
            do4: (p1: number) => void
        }
    };
}

const mystore = createStore<IMyState, IActions>({
    data: "d",
    val: 1
}, {
    do1: (store, p1: string, payload: number) => {
        //
    },
    do2(store, payload: string) {
        //
    },
    nms: {
        do3: (store, p1: number, p2: string, p3: Date) => {
            //
        },
        nms2: {
            do4: (store, p4: number) => {
                //
            }
        }
    }
})


const [state1, actions1] = mystore.useStore();
const [state2, actions2] = mystore.useStore(s => s.data);
const [state3, actions3] = mystore.useStore(s => s.data, a => a.do1);
const [state4, actions4] = mystore.useStore(undefined, a => a.do2);
const [state5, actions5] = mystore.useStore(undefined, a => a.nms);
const [state6, actions6] = mystore.useStore(s => s.val, a => a.nms.nms2);

const [state0, res] = mystore.useStore(undefined, a => a.do1)

*/