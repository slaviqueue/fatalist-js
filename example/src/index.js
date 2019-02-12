import StateMachine, { bindMappings, makeCommand, noOp } from 'fatalist'

const button = document.querySelector('button')
const span = document.querySelector('span')

const fetchUrl = 'https://jsonplaceholder.typicode.com/todos/1'
const request = data => fetch(fetchUrl)
    .then(response => response.json())

const loadTodoCommand = makeCommand(request, 'loaded')

const initialState = 'IDLE_STATE'
const initialData = { title: 'some initial text data' }
const stateMachineDefinition = ({
    IDLE_STATE: {
        load: ['LOADING_STATE', loadTodoCommand],
    },
    LOADING_STATE: {
        loaded: 'LOADED_STATE',
    },
    LOADED_STATE: {
        load: ['LOADING_STATE', loadTodoCommand],
    }
})

const stater = new StateMachine(initialState, initialData, stateMachineDefinition)

const buttonTextMappings = {
    IDLE_STATE: 'Load stuff',
    LOADING_STATE: 'Loading stuff...',
    LOADED_STATE: 'Here u go',
}

const buttonDisablingMappings = {
    LOADING_STATE: true,
}

const spanTextMappings = {
    LOADED_STATE: (span, data) => span.textContent = data.title
}

const getButtonText = bindMappings(buttonTextMappings).withDefault('Load stuff')
const getIsButtonDisabled = bindMappings(buttonDisablingMappings).withDefault(false)
const setSpanText = bindMappings(spanTextMappings).withDefault(noOp)

stater.subscribe((state, data) => {
    button.textContent = getButtonText(state)
    button.disabled = getIsButtonDisabled(state)

    setSpanText(state)(span, data)
})

button.addEventListener('click', () => stater.dispatch('load'))
