import * as io from 'io-ts'
import { none } from 'fp-ts/lib/Option'
import { Request, expectJson, get, post, } from 'elm-ts/lib/Http'
import { fromType } from 'elm-ts/lib/Decode'

const url = 'http://localhost:3001/person/'

const ioPerson = io.interface({
    id: io.union([io.number, io.null]),
    name: io.string,
    sureName: io.string,
    userType: io.string,
    date: io.union([io.string, io.null]),
    city: io.string,
    adress: io.string
})


export type Person = io.TypeOf<typeof ioPerson>
export type KorisnikResponse = io.TypeOf<typeof ioPerson>

// Runtime type
const ioPersons = io.array(ioPerson)
const ioKreiranjeResponse = io.interface({
    id: io.number,
})

// Typescript type from Runtime type
export type Persons = io.TypeOf<typeof ioPersons>
export type KreiranjeResponse = io.TypeOf<typeof ioKreiranjeResponse>

// Api call fn.
export const fetchUser = (): Request<Persons> => {
    return get(url, fromType(ioPersons))
}

// azuriranje korisnika
export const saveEdit = (korisnik: Person): Request<KorisnikResponse> => {
    return {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        url: `${url}${korisnik.id}`,
        body: korisnik,
        expect: expectJson(fromType(ioPerson)),
        timeout: none,
        withCredentials: false,
    }
}

//dodavanje korisnika
export const kreirajKorisnik = (korisnik: Person): Request<KreiranjeResponse> => {
    return post(url, ioPerson.encode(korisnik), fromType(ioKreiranjeResponse))
}

//brisanje koirsnika
export const deleteUser = (id: number): Request<void> => {
    return {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        url: `${url}${id}`,
        expect: expectJson(fromType(io.void)),
        timeout: none,
        withCredentials: false,
    }
}