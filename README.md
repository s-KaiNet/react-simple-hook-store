# Simple React hook based state management <!-- omit in toc -->

[![npm version](https://badge.fury.io/js/react-simple-hook-store.svg)](https://badge.fury.io/js/react-simple-hook-store)  

No Redux, no Mobx, no React Context API, just React hooks. It means React 16.8+ required and you can use it only with functional components.  

The project is heavily based on the [State Management with React Hooks — No Redux or Context API](https://medium.com/javascript-in-plain-english/state-management-with-react-hooks-no-redux-or-context-api-8b3035ceecf8) article and corresponding npm module. This project fixes some issues, adds new features and written in TypeScript.

## Table of contents <!-- omit in toc -->

- [The idea](#the-idea)
- [Installation](#installation)
- [Usage](#usage)
- [More examples:](#more-examples)
  - [Basic usage](#basic-usage)
  - [Async actions](#async-actions)
  - [Multiple stores](#multiple-stores)
  - [Different ways to access your store from components](#different-ways-to-access-your-store-from-components)
  - [Todo App](#todo-app)
- [API](#api)

----

## The idea

Your state is readonly and immutable. The only way to update the state from a component's code is through actions. If you want to update the state from outside a component, you can use store's `setState` method. All updates to the state should be immutable (the same way as you do for React's `setState` in class based components). You should define the structure of your state, your actions and start using them in your components.

## Installation

`$ npm install react-simple-hook-store --save`  

Or just add `dist/react-simple-hook-store.js` in your project through the script reference.

## Usage

Define your state structure:

```typescript
interface IState {
    counter: number;
}
```

Define actions, which modify your state:

```typescript
interface IActions {
    increment: () => void;
}
```

Create store. It accepts an initial state value as the first argument and your actions as the second. 

```typescript
import { createStore } from "react-simple-hook-store";

const { useStore, store } = createStore<IState, IActions>({
            counter: 0,
        }, {
          increment: (store) => {
                store.setState({
                    counter: store.state.counter + 1,
                });
            }
        });
```

`createStore` returns React hook, which you should use in your components. It accepts a map function, which returns subset of the whole state. If you want just full state, simply omit this parameter. The second param is actions map function. The same was as for state, if you want all actions, omit this parameter.   

```typescript
const Component = () => {
    const [counter, increment] = useStore((s) => s.counter, (a) => a.increment);

    return (
        <button onClick={() => increment()}>
            {counter}
        </button>
    );
};
```

`counter` will be your "local state" here. Every time other components (or current component) update counter state variable, the component will get re-rendered. Another way to read it: any updates to `counter` state will cause this component to be re-rendered.

If you want to modify the state outside of React, you can use `store` exported on the previous step.

## More examples:

### [Basic usage](https://codesandbox.io/s/basic-usage-n9ib6)

This sample contains bare minimum you need to setup to get started with `react-simple-hook-store`

### [Async actions](https://codesandbox.io/s/async-example-l7oo4)

You can have async actions inside your store

### Multiple stores

You can have as many stores as your application requires it. There are two ways to handle it - either use "namespaces" or simply create separate stores (if your stores are completely unrelated)

- [Separate stores](https://codesandbox.io/s/multiple-stores-separate-stores-3fyox)
- ["namespaced" stores](https://codesandbox.io/s/multiple-stores-namespaces-opii9)

### [Different ways to access your store from components](https://codesandbox.io/s/ways-to-access-store-from-components-583e0)

`useStore` hook has several overloads which might be useful in different situations.

### [Todo App](https://codesandbox.io/s/todo-app-x0rhd)

This sample showcases full Todo App. The store contains all todo items array and filter state. You don't necessarily need global state for your todos, but just for the demo purposes it's ok. It demonstrates how to update state correctly (immutably, including arrays).

## API

API