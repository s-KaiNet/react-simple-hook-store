# Simple React hook based state management
[![npm version](https://badge.fury.io/js/react-simple-hook-store.svg)](https://badge.fury.io/js/react-simple-hook-store)  

No Redux, no Mobx, no React Context API, just React hooks. It means React 16.8+ required and you can use it only with functional components.  

The project is heavily based on the [State Management with React Hooks — No Redux or Context API](https://medium.com/javascript-in-plain-english/state-management-with-react-hooks-no-redux-or-context-api-8b3035ceecf8) article and corresponding npm module. This project fixes some issues, adds new features and written in TypeScript.

----

## The idea

Your state is readonly. The only way to update the state from a component's code is through actions. If you want to update the state from outside a component, you can use store's `setState` method. You should define the structure of your state, your actions and start using them in your components.

## Installation

`$ npm install react-simple-hook-store --save`  

Or just `dist/react-simple-hook-store` in your project through the script reference.

## Usage

### Basic

Define your state structure:

```typescript
interface IState {
    counter: number;
}
```

Define actions, which modify state:

```typescript
interface IActions {
    increment: () => void;
}
```

Create store:

```typescript
import { createStore } from "react-simple-hook-store";

const { useStore } = createStore<IState, IActions>({
            counter: 0,
        }, {
          increment: (store) => {
                store.setState({
                    counter: store.state.counter + 1,
                });
            }
        });
```

Use it inside components:  

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
