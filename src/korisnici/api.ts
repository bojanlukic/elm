import * as io from "io-ts";
import { Request, get, post } from "elm-ts/lib/Http";
import { fromType } from "elm-ts/lib/Decode";

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

export const addUser = (user: Person): Request<Person> => {
  return post(url, user, fromType(ioPerson));
};
