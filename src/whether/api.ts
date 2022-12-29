import { fromType } from "elm-ts/lib/Decode";
import { Request, get } from "elm-ts/lib/Http";

import * as io from "io-ts";

const ioWeather = io.interface({
  name: io.string,
  temp: io.number,
  weather: io.string,
});

//Runtime type
const ioWeathers = io.array(ioWeather);

export type Weathers = io.TypeOf<typeof ioWeathers>;

export const fetchWeather = (criteria: string): Request<Weathers> => {
  return get(
    `https://api.openweathermap.org/data/2.5/weather?q=${criteria}&units=imperial&APPID=30d4741c779ba94c470ca1f63045390a`,
    fromType(ioWeathers)
  );
};
