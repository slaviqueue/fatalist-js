class StateMachine {
    constructor(initialState) {
        this.currentState = initialState
        this.states = {}

        this.addState(initialState)

        this.observers = []

        this.triggers = {}

        setTimeout(() => this._triggerObservers())
    }

    addState(stateName) {
        this.states[stateName] = {
            on: {}
        };
    }

    addTransition(from, to, message) {
        this.states[from].on[message] = to
    }

    dispatch(message) {
        const newState = this._getNewState(message)

        if (!newState)
            return
        
        if (this.triggers[message])
            this.triggers[message].forEach(cb => cb(message))

        this.currentState = newState

        this._triggerObservers()
    }

    setTrigger(message, cb) {
        if (!this.triggers[message])
            this.triggers[message] = []

        this.triggers[message].push(cb)
    }

    subscribe(cb) {
        this.observers.push(cb)
    }

    _getNewState(message) {
        return this.states[this.currentState].on[message]
    }

    _triggerObservers() {
        this.observers.forEach(cb => cb(this.currentState))
    }
}

export const bindMappings = mappings => ({
    withDefault(value) {
        return message => mappings[message] || value
    }
})

export default StateMachine
