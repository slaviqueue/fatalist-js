import assert from 'assert'
import StateMachine from '../src'

describe('StateMachine', () => {

    describe('#StateMachine(initialState, statesDefinition)', () => {
        it('should add states ', () => {
            const stateMachine = new StateMachine('DEFAULT_STATE', {
                DEFAULT_STATE: { on: {} },
                SECOND_STATE: { on: {} },
                THIRD_STATE: { on: {} }
            })

            assert.deepEqual(stateMachine.states, {
                DEFAULT_STATE: { on: {} },
                SECOND_STATE: { on: {} },
                THIRD_STATE: { on: {} }
            })
        })
    })

})