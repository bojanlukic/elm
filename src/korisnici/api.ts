import * as io from "io-ts";
import { Request, get, post, expectJson } from "elm-ts/lib/Http";
import { fromType } from "elm-ts/lib/Decode";
import { none } from "fp-ts/lib/Option";

const url = "http://localhost:3000/PERSON";

const ioPerson = io.interface({
  id: io.number,
  firstName: io.string,
  lastName: io.string,
  userType: io.string,
  createdDate: io.string,
  city: io.string,
  adress: io.string,
});

export type Person = io.TypeOf<typeof ioPerson>;

// Runtime type
const ioPersons = io.array(ioPerson);

// Typescript type from Runtime type
export type Persons = io.TypeOf<typeof ioPersons>;

// Api call fn.
export const fetchUser = (): Request<Persons> => {
  return get(url, fromType(ioPersons));
};
// pozivanje api-a za kreiranje
export const addUser = (korisnik: Person): Request<Person> => {
  return post(url, korisnik, fromType(ioPerson));
};

export const editUser = (korisnik: Person): Request<Person> => ({
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  url: `${url}/${korisnik.id}`,
  body: korisnik,
  expect: expectJson(fromType(ioPerson)),
  timeout: none,
  withCredentials: false,
});

export const ioDeletedUser = io.interface({});
export type DeletedUser = io.TypeOf<typeof ioDeletedUser>;

export const deleteUser = (id: number): Request<DeletedUser> => ({
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
  },
  url: `${url}/${id}`,
  expect: expectJson(fromType(ioDeletedUser)),
  timeout: none,
  withCredentials: false,
});
