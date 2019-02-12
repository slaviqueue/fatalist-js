class StateMachine {
    constructor(initialState, states) {
        this.currentState = initialState
        this.states = states

        this.observers = []
        this.triggers = {}

        setTimeout(() => this._triggerObservers())

        this.dispatch = this.dispatch.bind(this)
    }

    dispatch(message) {
        const newState = this._getNewState(message)

        if (!newState)
            return
        
        if (this.triggers[message])
            this.triggers[message].forEach(cb => cb(this.currentState, this.dispatch))

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
        return this.states[this.currentState][message]
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
