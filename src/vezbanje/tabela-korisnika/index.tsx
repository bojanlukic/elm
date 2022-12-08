import { Html } from 'elm-ts/lib/React';
import * as Cmd from 'elm-ts/lib/Cmd';
import { Either } from 'fp-ts/lib/Either';
import { send, HttpError } from 'elm-ts/lib/Http';
import { fetchUser, Persons, Person } from './api'
import { DetailsList, IColumn } from '@fluentui/react';
import moment from 'moment';

// --- Model
export type Model = {
    data: Persons | null
}

export const init: [Model, Cmd.Cmd<Msg>] = [{ data: null }, send(fetchUser(), response => ({ type: 'FetchUser', data: response }))]

// --- Messages
export type Msg = { type: 'FetchUser', data: Either<HttpError, Persons> }

// --- Update
export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
    switch (msg.type) {
        case 'FetchUser': {
            return msg.data.fold(error => {
                console.log(error)
                return [model, Cmd.none]
            }, data => [{ ...model, data }, Cmd.none])
        }
    }
}

const columns: IColumn[] = [{
    key: 'name',
    name: 'Ime i prezime',
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: Person) => <div>{item.name} {item.sureName}</div>
},
{
    key: 'userType',
    name: 'Zanimanje',
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: Person) => <div>{item.userType}</div>
},
{
    key: 'date',
    name: 'Datum',
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: Person) => <div>{moment(item.date).format("MM/DD/YYYY")}</div>
},
{
    key: 'city',
    name: 'Grad',
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: Person) => <div>{item.city}</div>
},
{
    key: 'adress',
    name: 'Adresa',
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: Person) => <div>{item.adress}</div>
}
]

// --- View
export const view = (model: Model): Html<Msg> => {
    return dispatch => (
        <div>
            <DetailsList items={model.data || []} columns={columns} />
        </div>
    )
}