# Simple React hook based state management <!-- omit in toc -->

[![npm version](https://badge.fury.io/js/react-simple-hook-store.svg)](https://badge.fury.io/js/react-simple-hook-store)  

No Redux, no Mobx, no React Context API, just React hooks. It means React 16.8+ required and you can use it only with functional components.  

The project is heavily based on the [State Management with React Hooks — No Redux or Context API](https://medium.com/javascript-in-plain-english/state-management-with-react-hooks-no-redux-or-context-api-8b3035ceecf8) article and corresponding npm module. This project fixes some issues, adds tests, new features and written in TypeScript.

<details>
<summary>Table of contents</summary>

- [The idea](#the-idea)
- [Installation](#installation)
- [Usage](#usage)
- [More examples](#more-examples)
  - [Basic usage](#basic-usage)
  - [Async actions](#async-actions)
  - [Multiple stores](#multiple-stores)
  - [Different ways to access your store from components](#different-ways-to-access-your-store-from-components)
  - [Todo App](#todo-app)
- [API](#api)
  - [`createStore<IStore, IActions>(initialState, actions)`](#createstoreistore-iactionsinitialstate-actions)
    - [Arguments](#arguments)
    - [Return value](#return-value)
  - [`useStore(mapState, mapActions)`](#usestoremapstate-mapactions)
    - [Arguments](#arguments-1)
    - [Return value](#return-value-1)
  - [`store` object](#store-object)
  - [`batchUpdates`](#batchupdates)

</details>

## The idea

Your state is readonly and immutable. The only way to update the state from a component's code is through actions. If you want to update the state from outside a component, you can use store's `setState` method. All updates to the state should be immutable (the same way as you do it for React's `setState` in class based components). You should define the structure of your state, your actions and start using them in your components.

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

`createStore` returns React hook called `useStore`, which you should use in your components. It accepts a map function, which returns subset of the whole state. The second param is actions map function. If you want all actions to be returned, omit this parameter.

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

`counter` will be your "local state" here. Every time other components (or current component) update `counter` state variable, the component will get re-rendered. Another way to read it: any updates to `counter` global state will cause this component to be re-rendered.

If you want to modify the state outside of React component, you can use `store` exported on the previous step.

## More examples

### [Basic usage](https://codesandbox.io/s/basic-usage-n9ib6)

This sample contains bare minimum you need to setup to get started with `react-simple-hook-store`

### [Async actions](https://codesandbox.io/s/async-example-l7oo4)

You can have async actions inside your store

### Multiple stores

You can have as many stores as your application needs. There are two ways to handle it - either use "namespaces" or simply create separate stores (if your stores are completely unrelated)

- [Separate stores](https://codesandbox.io/s/multiple-stores-separate-stores-3fyox)
- ["namespaced" stores](https://codesandbox.io/s/multiple-stores-namespaces-opii9)

### [Different ways to access your store from components](https://codesandbox.io/s/ways-to-access-store-from-components-b67tu)

`useStore` hook has several overloads which might be useful in different situations.

### [Todo App](https://codesandbox.io/s/todo-app-x0rhd)

This sample showcases full Todo App. The store contains all todo items as an array and filter state. You don't necessarily need global state for your todos, but just for the demo purposes it's ok. It demonstrates how to update state correctly (immutably, including arrays).

## API

### `createStore<IStore, IActions>(initialState, actions)`

Creates a store.

#### Arguments

- `initialState`: `object`, the initial state, supports multilevel, i.e.
  
  ```typescript
  {
      appState: {
          value: "myvalue"
      },
      navigation: {
          active: "node1"
      }
  }
  ```

- `actions`: `StoreActions<IState, IActions>` actions map. You use actions to modify state from components. For example:
  
  ```typescript
    interface IState {
        counter: number;
    }

    interface IActions {
        increment: () => void;
    }

    const actions: StoreActions<IState, IActions> = {
        increment: store => {
                store.setState({
                counter: store.state.counter + 1
            });
        }
    }
  ```

#### Return value

Object with properties (more on every property below):

- `useStore` - React hook to be used inside React functional components
- `store` - store instance, might be useful outside of React components
- `batchUpdates` - function wrapper to batch multiple setState to reduce the number of re-renders. For advanced performance tunning, in most cases you don't need it. More info below.

### `useStore(mapState, mapActions)`

#### Arguments

- `mapState`: a function, which returns a subset of the original state. When omitted, `undefined` will be returned. Current component will be re-rendered only if the result of `mapState` will be changed.
- `mapActions`: a function, which returns a subset of actions. When omitted, all actions will be returned

#### Return value

An array with two values:

- [0]: the result of `mapState` function, or `undefined` if `mapState` is `undefined`.
- [1]: the result of `mapActions` function or all actions if `mapActions` is `undefined`

### `store` object

Properties:

- `state` - readonly state object
- `actions` - all store actions

Methods:

- `setState` - a function which accepts subset of original state to modify the state. Works the same way as React's `setState` in class based components, i.e. merges provided value with original state.

### `batchUpdates`

A function, which accepts a callback. Inside that callback you can use as many `store.setState` as you wish. This will cause only one render inside React components.  
When it might be useful? If you perform multiple state updates as a result of async function (or as a result of timeout function). By default React will re-render your component as a result of **every** call to `setState`. More info in this React [issue](https://github.com/facebook/react/issues/14259).
