import * as io from 'io-ts'
import { Request, post } from 'elm-ts/lib/Http'
import { fromType } from 'elm-ts/lib/Decode'

const url = 'http://localhost:3001/person'

const ioKreirajKorisnikCmd = io.interface({
    name: io.string,
    sureName: io.string,
    userType: io.string,
    date: io.union([io.string, io.null]),
    city: io.string,
    adress: io.string
})

const ioKreiranjeResponse = io.interface({
    id: io.number,
})

export type KreirajKorisnikCmd = io.TypeOf<typeof ioKreirajKorisnikCmd>
export type KreiranjeResponse = io.TypeOf<typeof ioKreiranjeResponse>

export const kreirajKorisnik = (korisnik: KreirajKorisnikCmd): Request<KreiranjeResponse> => {
    return post(url, ioKreirajKorisnikCmd.encode(korisnik), fromType(ioKreiranjeResponse))
}
