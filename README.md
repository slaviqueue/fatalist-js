![](fatalist-logo.png)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Build Status](https://travis-ci.org/electricSemyon/fatalist-js.svg?branch=master)](https://travis-ci.org/electricSemyon/fatalist-js)

Another one js state management library based on state machines.

## Simple example

Let's say we have a button and we want to fetch some data, when clicking on it.

Simple markup:

```html
<body>
    <button></button>
    <span></span>

    <script src="dist/main.js"></script>
</body>
```

Find our button and span in DOM.

```javascript
import StateMachine, { bindMappings } from 'fatalist'

const button = document.querySelector('button')
const span = document.querySelector('span')
```

Then initialize our state machine with some initial state
```javascript
const stater = new StateMachine('IDLE_STATE')
```

Then we're going to describe our machine states and transitions between them.

To do that we'll use `addState` and `addTransition` methods.

`addState` applies just a name of addable state.

`addTransition` takes three arguments: `from`, `to` and `action`. First two are pretty obvious. Third one is some king of action, which should be fired to make the transition.

Notice, that if we want to reload data, we will make a transition from ```LOADED_STATE``` to the same ```LOADED_STATE```.
```javascript
stater.addState('IDLE_STATE')
stater.addState('LOADING_STATE')
stater.addState('LOADED_STATE')
stater.addTransition('IDLE_STATE', 'LOADING_STATE', 'load')
stater.addTransition('LOADING_STATE', 'LOADED_STATE', 'loaded')
stater.addTransition('LOADED_STATE', 'LOADED_STATE', 'loaded')
```
Of course we want to react on state changing in some way. So let's change the text inside button. We'll make it in a declarative way, by mapping texts to states.
```javascript
const buttonTextMappings = {
    IDLE_STATE: 'Load stuff',
    LOADING_STATE: 'Loading stuff...',
    LOADED_STATE: 'Here u go',
}
```

There's a helper, called ```bindMappings```. We will use it to map current state to text, which we want to see inside button, and in case, when we did not describe some case inside our mappings object, we'll fallback to default value.
```javascript
const getButtonText = bindMappings(buttonTextMappings).withDefault('Load stuff')
```
Subscribe on state changing. 
```javascript
stater.subscribe(state => {
    button.textContent = getButtonText(state)
})
```

You may be wondering, how will we handle side effects? There's a trigger mechanism in Fatalist. It's kinda similar to commands in Elm. We are reacting on some event by putting a trigger on it. It will be fired on a state change.
```javascript
stater.setTrigger('load', () =>
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(data => span.textContent = data.title)
        .then(_ => stater.dispatch('loaded')))
```

Put click listener on our button.
```javascript
button.addEventListener('click', () => stater.dispatch('load'))
```
