import * as Cmd from "elm-ts/lib/Cmd";
import { send, HttpError } from "elm-ts/lib/Http";
import { Html, map as HtmlMap } from "elm-ts/lib/React";
import { fetchWord, Words, Word } from "./api";
import { Either } from "fp-ts/lib/Either";
import * as Pregled from "./pregled";

import {
  DefaultButton,
  DetailsList,
  IColumn,
  Stack,
  TextField,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";

export type ActiveModel = {
  type: "Active";
  data: Words | null;
  inputValue: string;
  selected: Word | null;
  pregled?: Pregled.Model;
};

export type LoadingModel = { type: "Loading"; inputValue: string };

export type Model = ActiveModel | LoadingModel;

export const init: [Model, Cmd.Cmd<Msg>] = [
  { type: "Active", data: null, inputValue: "", selected: null },
  Cmd.none,
];

export type Msg =
  | { type: "StartFetchWord" }
  | { type: "FetchWord"; data: Either<HttpError, Words> }
  | { type: "ChangeInput"; value: string | null }
  | { type: "ChangeSelected"; value: Word | null }
  | { type: "StartPregled" }
  | { type: "Pregled"; value: Pregled.Msg };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "StartFetchWord":
      if (model.type !== "Active") return [model, Cmd.none];
      return [
        { type: "Loading", inputValue: model.inputValue },
        send(fetchWord(model.inputValue), (response) => ({
          type: "FetchWord",
          data: response,
        })),
      ];
    case "FetchWord":
      if (model.type !== "Loading") return [model, Cmd.none];
      return msg.data.fold(
        (error) => {
          alert(error);
          return [model, Cmd.none];
        },
        (data) => [
          {
            type: "Active",
            inputValue: model.inputValue,
            selected: null,
            data,
          } as Model,
          Cmd.none,
        ]
      );
    case "ChangeInput":
      if (model.type !== "Active") return [model, Cmd.none];
      return [{ ...model, inputValue: msg.value || "" }, Cmd.none];
    case "ChangeSelected":
      if (model.type !== "Active") return [model, Cmd.none];
      console.log(model);
      console.log(msg.value);
      return [{ ...model, selected: msg.value }, Cmd.none];
    case "StartPregled":
      if (model.type !== "Active") return [model, Cmd.none];
      if (model.selected === null) return [model, Cmd.none];
      const [pregledModel, pregledMsg] = Pregled.init(model.selected);
      return [
        { ...model, pregled: pregledModel },
        Cmd.map(pregledMsg, (value) => ({ type: "Pregled", value })),
      ];
    case "Pregled": {
      if (model.type !== "Active") return [model, Cmd.none];
      if (model.pregled === undefined) return [model, Cmd.none];
      const [pregledModel, pregledMsg] = Pregled.update(
        msg.value,
        model.pregled
      );
      if (pregledModel.type === "Success") return init;
      if (pregledModel.type === "Cancel")
        return [{ ...model, pregled: undefined }, Cmd.none];
      return [
        { ...model, pregled: pregledModel },
        Cmd.map(pregledMsg, (value) => ({ type: "Pregled", value })),
      ];
    }
  }
};
const columns: IColumn[] = [
  {
    key: "words",
    name: "Word",
    minWidth: 200,
    maxWidth: 200,
    onRender: (item: Word) => <div>{item.word}</div>,
  },
  {
    key: "scores",
    name: "Score",
    minWidth: 200,
    maxWidth: 200,
    onRender: (item: Word) => <div>{item.score}</div>,
  },
];
export const activeView = (model: ActiveModel): Html<Msg> => {
  const { pregled, data, selected, inputValue } = model;
  return (dispatch) => (
    <Stack horizontalAlign="center">
      <Stack horizontal={true} tokens={{ childrenGap: 10 }}>
        <TextField
          value={model.inputValue}
          onChange={(_, newValue) =>
            dispatch({ type: "ChangeInput", value: newValue || "" })
          }
        />
        <DefaultButton
          text="Pretraga"
          iconProps={{ iconName: "Search" }}
          onClick={() => dispatch({ type: "StartFetchWord" })}
          disabled={inputValue === ""}
        />
        <DefaultButton
          text="Pregled"
          iconProps={{ iconName: "TextDocument" }}
          onClick={() => dispatch({ type: "StartPregled" })}
          disabled={!selected}
        />
      </Stack>
      {data && (
        <DetailsList
          items={data || []}
          columns={columns}
          onActiveItemChanged={(item) =>
            dispatch({ type: "ChangeSelected", value: item })
          }
        />
      )}
      {pregled &&
        HtmlMap(
          Pregled.view(pregled),
          (value) => ({ type: "Pregled", value } as Msg)
        )(dispatch)}
    </Stack>
  );
};
export const loadingView = (model: LoadingModel): Html<Msg> => {
  return (_dispatch) => (
    <Stack grow={1} styles={{ root: { height: "90vh", width: "98vw" } }}>
      <Stack
        horizontal={true}
        horizontalAlign="center"
        tokens={{ childrenGap: 10 }}
      >
        <TextField value={model.inputValue} disabled={true} />
        <DefaultButton
          text="Pretraga"
          iconProps={{ iconName: "Search" }}
          disabled={true}
        />
        <DefaultButton
          text="Pregled"
          iconProps={{ iconName: "TextDocument" }}
          disabled={true}
        />
      </Stack>
      <Stack grow={3} horizontalAlign="center" verticalAlign="center">
        <Spinner size={SpinnerSize.large} />
      </Stack>
    </Stack>
  );
};

export const view =
  (model: Model): Html<Msg> =>
  (dispatch) =>
    model.type === "Active"
      ? activeView(model)(dispatch)
      : loadingView(model)(dispatch);
