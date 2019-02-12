import StateMachine, { bindMappings } from 'fatalist'

const button = document.querySelector('button')
const span = document.querySelector('span')

const stater = new StateMachine('IDLE_STATE', {
    IDLE_STATE: {
        load: 'LOADING_STATE',
    },
    LOADING_STATE: {
        loaded: 'LOADED_STATE',
    },
    LOADED_STATE: {
        load: 'LOADING_STATE',
    }
})

const buttonTextMappings = {
    IDLE_STATE: 'Load stuff',
    LOADING_STATE: 'Loading stuff...',
    LOADED_STATE: 'Here u go',
}

const buttonDisablingMappings = {
    LOADING_STATE: true,
}

const getButtonText = bindMappings(buttonTextMappings).withDefault('Load stuff')
const getIsButtonDisabled = bindMappings(buttonDisablingMappings).withDefault(false)

stater.subscribe(state => {
    button.textContent = getButtonText(state)
    button.disabled = getIsButtonDisabled(state)
})

const onLoadTrigger = (currentState, dispatch) =>
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(data => span.textContent = data.title)
        .then(_ => dispatch('loaded'))

stater.setTrigger('load', onLoadTrigger)

button.addEventListener('click', () => stater.dispatch('load'))
