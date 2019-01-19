import StateMachine, { bindMappings } from 'fatalist'

const button = document.querySelector('button')
const span = document.querySelector('span')
const stater = new StateMachine('IDLE_STATE')

const buttonTextMappings = {
    IDLE_STATE: 'Load stuff',
    LOADING_STATE: 'Loading stuff...',
    LOADED_STATE: 'Here u go',
}

const buttonDisablingMappings = {
    LOADING_STATE: true,
}

stater.addState('IDLE_STATE')
stater.addState('LOADING_STATE')
stater.addState('LOADED_STATE')
stater.addTransition('IDLE_STATE', 'LOADING_STATE', 'load')
stater.addTransition('LOADING_STATE', 'LOADED_STATE', 'loaded')
stater.addTransition('LOADED_STATE', 'LOADING_STATE', 'load')

const getButtonText = bindMappings(buttonTextMappings).withDefault('Load stuff')
const getIsButtonDisabled = bindMappings(buttonDisablingMappings).withDefault(false)

stater.subscribe(state => {
    button.textContent = getButtonText(state)
    button.disabled = getIsButtonDisabled(state)
})

stater.setTrigger('load', () =>
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => (new Promise(resolve => setTimeout(() => resolve(response), 500)))) // little delay to see results
        .then(response => response.json())
        .then(data => span.textContent = JSON.stringify(data.title))
        .then(_ => stater.dispatch('loaded')))

button.addEventListener('click', () => stater.dispatch('load'))
