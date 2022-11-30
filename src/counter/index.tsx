import { Html } from 'elm-ts/lib/React';
import * as Cmd from 'elm-ts/lib/Cmd';
import { DefaultButton, PrimaryButton, TextField } from '@fluentui/react';

// --- Model
export type Model = {
  counter: number,
  inputValue : string,
}

export const init: [Model, Cmd.Cmd<Msg>] = [{ counter: 0, inputValue: '' }, Cmd.none]

// --- Messages
export type Msg = { type: 'Increment' } | { type: 'Decrement' } | { type: 'Reset' } | {type : 'ChangeInput' , value: string} | {type : 'Plus' , value : number} | {type: 'Minus' , value : number}

// --- Update
export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case 'Increment':
      return [{ ...model, counter: model.counter + 1 }, Cmd.none]
    case 'Decrement':
      return [{ ...model, counter: model.counter - 1 }, Cmd.none]
    case 'Reset':
      return [{ ...model, counter: 0 }, Cmd.none]
    case 'ChangeInput': 
      return [{ ...model, inputValue: msg.value }, Cmd.none]
    case 'Plus': 
      return [{ ...model, counter: msg.value + model.counter }, Cmd.none]
    case 'Minus': 
      return [{ ...model, counter: model.counter - msg.value }, Cmd.none]
  }
}

// --- View
export const view = (model: Model): Html<Msg> => {
  return dispatch => (
    <div className='app'>
      Count: {model.counter}
      <DefaultButton text='+' onClick={() => dispatch({ type: 'Increment' })} />
      <DefaultButton text='-' onClick={() => dispatch({ type: 'Decrement' })} />
      <PrimaryButton text='Reset' onClick={() => dispatch({ type: 'Reset' })} /><br/><br/>
      <TextField value={model.inputValue} onChange={(_, newValue) => dispatch({ type: 'ChangeInput', value: newValue || '' })} />
      <DefaultButton text='+' onClick={() => dispatch({ type: 'Plus', value: Number(model.inputValue) })} />
      <DefaultButton text='-' onClick={() => dispatch({ type: 'Minus' , value: Number(model.inputValue) })} />
    </div>
  )
}