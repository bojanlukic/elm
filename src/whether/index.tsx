import { DefaultButton, Stack, TextField, Text } from "@fluentui/react";
import * as Cmd from "elm-ts/lib/Cmd";
import { send, HttpError } from "elm-ts/lib/Http";
import { Either } from "fp-ts/lib/Either";
import { fetchWeather, Weathers } from "./api";
import { Html } from "elm-ts/lib/React";

export type Model = {
  data: Weathers | null;
  input: string;
};

export const init: [Model, Cmd.Cmd<Msg>] = [
  { data: null, input: "" },
  Cmd.none,
];

export type Msg =
  | { type: "StartFetch" }
  | { type: "FetchWeather"; data: Either<HttpError, Weathers> }
  | { type: "UnesiGrad"; value: string };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "StartFetch":
      return [
        model,
        send(fetchWeather(model.input), (response) => ({
          type: "FetchWeather",
          data: response,
        })),
      ];

    case "FetchWeather":
      return msg.data.fold(
        (error) => {
          alert(error);
          return [model, Cmd.none];
        },
        (data) => [
          {
            ...model,
            data,
          } as Model,
          Cmd.none,
        ]
      );
    case "UnesiGrad":
      return [{ ...model, input: msg.value }, Cmd.none];
  }
};

export const view = (model: Model): Html<Msg> => {
  const { data, input } = model;
  return (dispatch) => (
    <Stack>
      <Stack
        horizontal={true}
        horizontalAlign="center"
        tokens={{ childrenGap: 10 }}
      >
        <TextField
          placeholder="Unesi grad..."
          value={input}
          onChange={(_, newValue) =>
            dispatch({ type: "UnesiGrad", value: newValue || "" })
          }
        />
        <DefaultButton
          text="Trazi"
          iconProps={{ iconName: "Search" }}
          onClick={() => dispatch({ type: "StartFetch" })}
          disabled={!input}
        />
      </Stack>
      <Stack horizontalAlign="center" style={{ marginTop: "20px" }}>
        {model.data && (
          <Stack>
            <Text>{data.name}</Text>
            <Text>{data.main.temp} </Text>
            <Text> {data.weather[0].main} </Text>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
