import * as Cmd from "elm-ts/lib/Cmd";
import { send, HttpError } from "elm-ts/lib/Http";
import { Either } from "fp-ts/lib/Either";
import { fetchGif, Gifs } from "./api";
import { Html, map as HtmlMap } from "elm-ts/lib/React";
import {
  DefaultButton,
  Spinner,
  SpinnerSize,
  Stack,
  TextField,
} from "@fluentui/react";

export type ActiveModel = {
  type: "Active";
  data: Gifs | null;
  input: string;
};

export type LoadingModel = { type: "Loading"; input: string };

export type Model = ActiveModel | LoadingModel;

export const init: [Model, Cmd.Cmd<Msg>] = [
  { type: "Active", data: null, input: "" },
  Cmd.none,
];

export type Msg =
  | { type: "StartFetchGif" }
  | { type: "FetchGif"; data: Either<HttpError, Gifs> }
  | { type: "UnesiRec"; value: string };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "StartFetchGif":
      if (model.type !== "Active") return [model, Cmd.none];
      return [
        { type: "Loading", input: model.input },
        send(fetchGif(model.input), (response) => ({
          type: "FetchGif",
          data: response,
        })),
      ];
    case "FetchGif":
      if (model.type !== "Loading") return [model, Cmd.none];
      return msg.data.fold(
        (error) => {
          alert(error);
          return [model, Cmd.none];
        },
        (data) => [
          {
            type: "Active",
            input: model.input,
            data,
          } as Model,
          Cmd.none,
        ]
      );
    case "UnesiRec":
      if (model.type !== "Active") return [model, Cmd.none];
      return [{ ...model, input: msg.value }, Cmd.none];
  }
};

export const activeView = (model: ActiveModel): Html<Msg> => {
  const { data, input } = model;
  return (dispatch) => (
    <Stack>
      <Stack
        horizontal={true}
        horizontalAlign="center"
        tokens={{ childrenGap: 10 }}
      >
        <TextField
          placeholder="Unesi rec..."
          value={input}
          onChange={(_, newValue) =>
            dispatch({ type: "UnesiRec", value: newValue || "" })
          }
        />
        <DefaultButton
          text="Trazi"
          iconProps={{ iconName: "Search" }}
          onClick={() => dispatch({ type: "StartFetchGif" })}
          disabled={!input}
        />
      </Stack>
      <Stack horizontalAlign="center" style={{ marginTop: "50px" }}>
        {data && (
          <img
            src={data.data.images.downsized.url}
            width="500px"
            height="500px"
          />
        )}
      </Stack>
    </Stack>
  );
};

export const loadingView = (model: LoadingModel): Html<Msg> => {
  return (_dispatch) => (
    <Stack horizontalAlign="center" verticalAlign="center">
      <Spinner size={SpinnerSize.large} />
    </Stack>
  );
};

export const view =
  (model: Model): Html<Msg> =>
  (dispatch) =>
    model.type === "Active"
      ? activeView(model)(dispatch)
      : loadingView(model)(dispatch);
