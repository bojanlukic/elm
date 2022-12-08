import * as io from 'io-ts'
import { Request, get } from 'elm-ts/lib/Http'
import { fromType } from 'elm-ts/lib/Decode'

const url = 'http://localhost:3001/person'

const ioPerson = io.interface({
    id: io.number,
    name: io.string,
    sureName: io.string,
    userType: io.string,
    date: io.string,
    city: io.string,
    adress: io.string
})


export type Person = io.TypeOf<typeof ioPerson>

// Runtime type
const ioPersons = io.array(ioPerson)

// Typescript type from Runtime type
export type Persons = io.TypeOf<typeof ioPersons>


// Api call fn.
export const fetchUser = (): Request<Persons> => {
    return get(url, fromType(ioPersons))
}