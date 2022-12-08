import { Html } from 'elm-ts/lib/React';
import * as Cmd from 'elm-ts/lib/Cmd';
import { Either } from 'fp-ts/lib/Either'
import { TextField, DefaultButton } from '@fluentui/react';
import { send, HttpError } from 'elm-ts/lib/Http'
import { getCurrentDate } from '../currentdate/currentdateeffect';
import { kreirajKorisnik, KreirajKorisnikCmd as Form, KreiranjeResponse } from './api'
import moment from 'moment'
import Loading from '../kreiranje/loading';

// --- Model

type InitializingModel = { type: 'InitializingModel' }

type ActiveModel = {
    type: 'ActiveModel',
    form: Form,
}

type LoadingModel = {
    type: 'LoadingModel'
    blockedModel: ActiveModel
}

type Model = InitializingModel | ActiveModel | LoadingModel

type Msg
    = { type: 'CurrentDate', value: Date }
    | { type: 'Saving' }
    | { type: 'Saved', value: Either<HttpError, KreiranjeResponse> }
    | { type: 'OnChangeName', value: string }
    | { type: 'OnChangeSureName', value: string }
    | { type: 'OnChangeUserType', value: string }
    | { type: 'OnChangeCity', value: string }
    | { type: 'OnChangeAdress', value: string }

const initialFormValue: Form = {
    name: '',
    sureName: '',
    userType: '',
    date: null,
    city: '',
    adress: '',
}

export const init: [Model, Cmd.Cmd<Msg>] = [{ type: 'InitializingModel' }, getCurrentDate(date => ({ type: 'CurrentDate', value: date }))]

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
    switch (msg.type) {
        case 'CurrentDate': {
            if (model.type !== 'InitializingModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ type: 'ActiveModel', form: { ...initialFormValue, date: moment(msg.value).format('MM/DD/YYYY') } }, Cmd.none]
        }
        case 'OnChangeName': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ type: 'ActiveModel', form: { ...model.form, name: msg.value } }, Cmd.none]
        }
        case 'OnChangeSureName': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ type: 'ActiveModel', form: { ...model.form, sureName: msg.value } }, Cmd.none]
        }
        case 'OnChangeUserType': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ type: 'ActiveModel', form: { ...model.form, userType: msg.value } }, Cmd.none]
        }
        case 'OnChangeCity': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ type: 'ActiveModel', form: { ...model.form, city: msg.value } }, Cmd.none]
        }
        case 'OnChangeAdress': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ type: 'ActiveModel', form: { ...model.form, adress: msg.value } }, Cmd.none]
        }
        case 'Saving': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ type: 'LoadingModel', blockedModel: model }, send(kreirajKorisnik(model.form), response => ({ type: 'Saved', value: response }))]
        }
        case 'Saved': {
            if (model.type !== 'LoadingModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return msg.value.fold((error) => {
                console.log(error)
                return [{ type: 'ActiveModel', form: model.blockedModel.form }, Cmd.none]
            }, response => {
                console.log('Uspesno kreiran korisnik pod ID: ', response.id)
                return [{ type: 'ActiveModel', form: model.blockedModel.form }, getCurrentDate(date => ({ type: 'CurrentDate', value: date }))]
            })
        }
    }
}

export const view = (model: Model): Html<Msg> => {
    return dispatch => {
        switch (model.type) {
            case 'InitializingModel': {
                return <p>Inicijalizacija...</p>
            }
            case 'ActiveModel': {
                return (
                    <div className='app'>
                        <TextField className='textFieldGif' label='Ime' value={model.form.name} onChange={(_, newValue) => dispatch({ type: 'OnChangeName', value: newValue || '' })} />
                        <TextField className='textFieldGif' label='Prezime' value={model.form.sureName} onChange={(_, newValue) => dispatch({ type: 'OnChangeSureName', value: newValue || '' })} />
                        <TextField className='textFieldGif' label='Zanimanje' value={model.form.userType} onChange={(_, newValue) => dispatch({ type: 'OnChangeUserType', value: newValue || '' })} />
                        <TextField className='textFieldGif' label='Grad' value={model.form.city} onChange={(_, newValue) => dispatch({ type: 'OnChangeCity', value: newValue || '' })} />
                        <TextField className='textFieldGif' label='Adresa' value={model.form.adress} onChange={(_, newValue) => dispatch({ type: 'OnChangeAdress', value: newValue || '' })} />
                        <TextField className='textFieldGif' label='Datum' value={model.form.date || ''} disabled={false} />
                        <DefaultButton className='gifSearchButton' text='Dodaj korisnika' onClick={() => dispatch({ type: 'Saving' })} />
                    </div>
                )
            }
            case 'LoadingModel': {
                return (
                    <Loading />
                )
            }
        }
    }
}
