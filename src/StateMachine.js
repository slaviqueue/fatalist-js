class StateMachine {
    constructor(initialState, initialData, states) {
        this.currentState = initialState
        this.states = states
        this.observers = []

        this.data = initialData;

        setTimeout(() => this._triggerObservers())

        this.dispatch = this.dispatch.bind(this)
    }

    dispatch(message, stateChanger) {
        const transition = this._getNewState(message)
        const isTransitionWithCommand = Array.isArray(transition)
        const newState = isTransitionWithCommand
            ? transition[0]
            : transition

        if (!newState)
            return

        if (isTransitionWithCommand) {
            const [request, transitionOnResolve] = transition[1]

            request(data)
                .then(data => this.data = data)
                .then(() => this.dispatch(transitionOnResolve))
        }

        if (stateChanger)
            data = stateChanger(data)

        this.currentState = newState

        this._triggerObservers()
    }

    subscribe(cb) {
        this.observers.push(cb)
    }

    _getNewState(message) {
        console.log(this.states, message, this.currentState)
        return this.states[this.currentState][message]
    }

    _triggerObservers() {
        this.observers.forEach(cb => cb(this.currentState, this.data))
    }
}

export default StateMachine
