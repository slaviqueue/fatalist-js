import assert from 'assert'
import StateMachine from '../src'

describe('StateMachine', () => {

    describe('#addState()', () => {
        it('should add states ', () => {
            const stateMachine = new StateMachine('DEFAULT_STATE')

            stateMachine.addState('SECOND_STATE')
            stateMachine.addState('THIRD_STATE')

            assert.deepEqual(stateMachine.states, {
                DEFAULT_STATE: { on: {} },
                SECOND_STATE: { on: {} },
                THIRD_STATE: { on: {} }
            })
        })
    })

    describe('#addTransition()', () => {
        it('should add transitions between states after dispatching some action', () => {
            const stateMachine = new StateMachine('WARM')

            stateMachine.addState('COLD')
            stateMachine.addState('HOT')

            stateMachine.addTransition('HOT', 'WARM', 'FREEZE')
            stateMachine.addTransition('WARM', 'COLD', 'FREEZE')
            stateMachine.addTransition('COLD', 'WARM', 'HEAT')
            stateMachine.addTransition('WARM', 'HOT', 'HEAT')

            assert.deepEqual(stateMachine.states, {
                WARM: {
                    on: {
                        FREEZE: 'COLD',
                        HEAT: 'HOT'
                    }
                },
                COLD: { on: { HEAT: 'WARM' } },
                HOT: { on: { FREEZE: 'WARM' } }
            })
        })
    })

})