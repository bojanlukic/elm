import { fromType } from "elm-ts/lib/Decode";
import { Request, get } from "elm-ts/lib/Http";

import * as io from "io-ts";

const ioWord = io.interface({
  word: io.string,
  score: io.number,
});

export type Word = io.TypeOf<typeof ioWord>;

// Runtime type
const ioWords = io.array(ioWord);

// Typescript type from Runtime type
export type Words = io.TypeOf<typeof ioWords>;

export const fetchWord = (criteria: string): Request<Words> => {
  return get(
    `https://api.datamuse.com/words?rel_syn=${criteria}`,
    fromType(ioWords)
  );
};
