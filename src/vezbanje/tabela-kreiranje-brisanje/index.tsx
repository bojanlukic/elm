import { Html } from 'elm-ts/lib/React';
import * as Cmd from 'elm-ts/lib/Cmd';
import { Either } from 'fp-ts/lib/Either'
import { DetailsList, IColumn, TextField, DefaultButton } from '@fluentui/react';
import { send, HttpError } from 'elm-ts/lib/Http'
import { saveEdit, fetchUser, KorisnikResponse, Person, Persons, Persons as Table, kreirajKorisnik, KreiranjeResponse, deleteUser } from './api'
import Loading from '../kreiranje/loading';
import moment from 'moment';


// --- Model

type Form = Person

type InitializingModel = { type: 'InitializingModel' }

type ActiveModel = {
    type: 'ActiveModel',
    tableData: Table,
    form: Form,
    formAdd: Form,
    selectedItem: Persons
}

type LoadingModel = {
    type: 'LoadingModel'
    blockedModel: ActiveModel
}

type Model = InitializingModel | ActiveModel | LoadingModel

type Msg
    = { type: 'FetchUser', value: Either<HttpError, Persons> }
    | { type: 'EditName', value: string }
    | { type: 'EditSureName', value: string }
    | { type: 'EditUserType', value: string }
    | { type: 'EditCity', value: string }
    | { type: 'EditAdress', value: string }
    | { type: 'ChangeName', value: string }
    | { type: 'ChangeSureName', value: string }
    | { type: 'ChangeUserType', value: string }
    | { type: 'ChangeCity', value: string }
    | { type: 'ChangeAdress', value: string }
    | { type: 'SavingEdit' }
    | { type: 'Saving' }
    | { type: 'SavedEdit', value: Either<HttpError, KorisnikResponse> }
    | { type: 'Saved', value: Either<HttpError, KreiranjeResponse> }
    | { type: 'ChangeSelection', value: Person[] }
    | { type: 'StartDelete', value: number }
    | { type: 'Deleted' }

const initialTableValue: Table = []

const initialFormValue: Form = {
    id: null,
    name: '',
    sureName: '',
    userType: '',
    date: '',
    city: '',
    adress: '',
}
const columns = (dispatch: any): IColumn[] => [{
    key: 'name',
    name: 'Ime i prezime',
    minWidth: 120,
    maxWidth: 120,
    onRender: (item: Person) => <div>{item.name} {item.sureName} </div>

},
{
    key: 'userType',
    name: 'Zanimanje',
    minWidth: 120,
    maxWidth: 120,
    onRender: (item: Person) => <div>{item.userType}</div>
},
{
    key: 'date',
    name: 'Datum',
    minWidth: 120,
    maxWidth: 120,
    onRender: (item: Person) => <div>{moment(item.date).format("MM/DD/YYYY")}</div>
},
{
    key: 'city',
    name: 'Grad',
    minWidth: 120,
    maxWidth: 120,
    onRender: (item: Person) => <div>{item.city}</div>
},
{
    key: 'adress',
    name: 'Adresa',
    minWidth: 120,
    maxWidth: 120,
    onRender: (item: Person) => <div>{item.adress}</div>
},
{
    key: 'delete',
    name: 'Obriši korisnika',
    minWidth: 120,
    maxWidth: 120,
    onRender: (item: Person) => <div><DefaultButton className='delete' text='Obriši' onClick={() => dispatch({ type: 'StartDelete', value: item.id })} /></div>
}
]


export const init: [Model, Cmd.Cmd<Msg>] = [{ type: 'InitializingModel' }, send(fetchUser(), response => ({ type: 'FetchUser', value: response }))]

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
    switch (msg.type) {
        case 'FetchUser': {
            if (model.type !== 'InitializingModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return msg.value.fold((error) => {
                console.log(error)
                return [{ type: 'ActiveModel', tableData: initialTableValue, form: initialFormValue, selectedItem: [], formAdd: initialFormValue }, Cmd.none]
            }, value => [{ type: 'ActiveModel', tableData: value, form: initialFormValue, selectedItem: [], formAdd: initialFormValue }, Cmd.none]
            )
        }
        case 'EditName': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ ...model, form: { ...model.form, name: msg.value } }, Cmd.none]
        }

        case 'EditSureName': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ ...model, form: { ...model.form, sureName: msg.value } }, Cmd.none]
        }
        case 'EditUserType': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ ...model, form: { ...model.form, userType: msg.value } }, Cmd.none]
        }
        case 'EditCity': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ ...model, form: { ...model.form, city: msg.value } }, Cmd.none]
        }
        case 'EditAdress': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ ...model, form: { ...model.form, adress: msg.value } }, Cmd.none]
        }
        case 'ChangeName': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ ...model, formAdd: { ...model.formAdd, name: msg.value } }, Cmd.none]
        }

        case 'ChangeSureName': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ ...model, formAdd: { ...model.formAdd, sureName: msg.value } }, Cmd.none]
        }
        case 'ChangeUserType': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ ...model, formAdd: { ...model.formAdd, userType: msg.value } }, Cmd.none]
        }
        case 'ChangeCity': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ ...model, formAdd: { ...model.formAdd, city: msg.value } }, Cmd.none]
        }
        case 'ChangeAdress': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ ...model, formAdd: { ...model.formAdd, adress: msg.value } }, Cmd.none]
        }
        case 'ChangeSelection': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ ...model, selectedItem: msg.value, form: msg.value[0] }, Cmd.none]
        }
        case 'SavingEdit': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ type: 'LoadingModel', blockedModel: model }, send(saveEdit(model.form), response => ({ type: 'SavedEdit', value: response }))]
        }
        case 'SavedEdit': {
            if (model.type !== 'LoadingModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return msg.value.fold((error) => {
                console.log(error)
                return init
            }, response => {
                console.log('Uspesno promenjen korisnik pod ID: ', response.id)
                return init
            })
        }
        case 'Saving': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ type: 'LoadingModel', blockedModel: model }, send(kreirajKorisnik(model.formAdd), response => ({ type: 'Saved', value: response }))]
        }
        case 'Saved': {
            if (model.type !== 'LoadingModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return msg.value.fold((error) => {
                console.log(error)
                return init
            }, response => {
                console.log('Uspesno promenjen korisnik pod ID: ', response.id)
                return init
            })
        }
        case 'StartDelete': {
            if (model.type !== 'ActiveModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return [{ type: 'LoadingModel', blockedModel: model }, send(deleteUser(msg.value), () => ({ type: 'Deleted' }))]
        }
        case 'Deleted': {
            if (model.type !== 'LoadingModel') {
                console.warn('NEVALIDNO STANJE MODELA!!!')
                return [model, Cmd.none]
            }
            return init
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
                    <div className='table-form'>
                        <div className='table'>
                            <DetailsList onActiveItemChanged={item => dispatch({ type: 'ChangeSelection', value: [item] })} items={model.tableData || []} columns={columns(dispatch)} />
                        </div>
                        <div className='forms'>
                            <div className='form'>
                                <h4>Ažuriraj korisnika</h4>
                                <TextField className='textField' label='Ime' value={model.form.name} onChange={(_, newValue) => dispatch({ type: 'EditName', value: newValue || '' })} />
                                <TextField className='textField' label='Prezime' value={model.form.sureName} onChange={(_, newValue) => dispatch({ type: 'EditSureName', value: newValue || '' })} />
                                <TextField className='textField' label='Zanimanje' value={model.form.userType} onChange={(_, newValue) => dispatch({ type: 'EditUserType', value: newValue || '' })} />
                                <TextField className='textField' label='Grad' value={model.form.city} onChange={(_, newValue) => dispatch({ type: 'EditCity', value: newValue || '' })} />
                                <TextField className='textField' label='Adresa' value={model.form.adress} onChange={(_, newValue) => dispatch({ type: 'EditAdress', value: newValue || '' })} />
                                <TextField className='textField' label='Datum' value={model.form.date || ''} disabled={false} />
                                <DefaultButton className='gifSearchButton' text='Sačuvaj izmenu' onClick={() => dispatch({ type: 'SavingEdit' })} />
                            </div>
                            <div className='form'>
                                <h4>Dodaj korisnika</h4>
                                <TextField className='textField' label='Ime' value={model.formAdd.name} onChange={(_, newValue) => dispatch({ type: 'ChangeName', value: newValue || '' })} />
                                <TextField className='textField' label='Prezime' value={model.formAdd.sureName} onChange={(_, newValue) => dispatch({ type: 'ChangeSureName', value: newValue || '' })} />
                                <TextField className='textField' label='Zanimanje' value={model.formAdd.userType} onChange={(_, newValue) => dispatch({ type: 'ChangeUserType', value: newValue || '' })} />
                                <TextField className='textField' label='Grad' value={model.formAdd.city} onChange={(_, newValue) => dispatch({ type: 'ChangeCity', value: newValue || '' })} />
                                <TextField className='textField' label='Adresa' value={model.formAdd.adress} onChange={(_, newValue) => dispatch({ type: 'ChangeAdress', value: newValue || '' })} />
                                <TextField className='textField' label='Datum' value={model.formAdd.date || ''} disabled={false} />
                                <DefaultButton className='gifSearchButton' text='Sačuvaj korisnika' onClick={() => dispatch({ type: 'Saving' })} />
                            </div>
                        </div>
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