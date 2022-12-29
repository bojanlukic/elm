import * as io from "io-ts";
import { Request, get } from "elm-ts/lib/Http";
import { fromType } from "elm-ts/lib/Decode";

const url =
  "http://api.giphy.com/v1/gifs/random?api_key=rsoMA4Twgm0rV4FKx6EZP7KzBuLafqS8&tag=";

// Runtime type
const ioGifs = io.interface({
  data: io.interface({
    images: io.interface({
      downsized: io.interface({
        url: io.string,
      }),
    }),
  }),
});

// Typescript type from Runtime type
export type Gifs = io.TypeOf<typeof ioGifs>;

// Api call fn.
export const fetchGif = (criteria: string): Request<Gifs> => {
  return get(`${url}${criteria}`, fromType(ioGifs));
};
