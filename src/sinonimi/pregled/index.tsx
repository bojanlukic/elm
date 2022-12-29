import { Html } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import { Dialog, Stack, TextField } from "@fluentui/react";
import { Word } from "../api";

export type ActiveModel = { type: "Active"; original: Word };
export type CancelModel = { type: "Cancel" };

export type Model = ActiveModel | CancelModel;

export const init = (original: Word): [Model, Cmd.Cmd<Msg>] => [
  {
    type: "Active",
    original,
  },
  Cmd.none,
];

export type Msg = { type: "Cancel" };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "Cancel":
      if (model.type !== "Active") return [model, Cmd.none];
      return [{ type: "Cancel" }, Cmd.none];
  }
};

export const activeView = (model: ActiveModel): Html<Msg> => {
  return (dispatch) => (
    <Dialog
      minWidth={400}
      hidden={false}
      dialogContentProps={{ title: "Pregled" }}
      modalProps={{ isBlocking: true }}
      onDismiss={() => dispatch({ type: "Cancel" })}
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <TextField label="Word" value={model.original.word} disabled={true} />
        <TextField
          label="Score"
          value={String(model.original.score)}
          disabled={true}
        />
      </Stack>
    </Dialog>
  );
};

export const restView = (): Html<Msg> => (_dispatch) => <></>;

export const view = (model: Model): Html<Msg> => {
  return (dispatch) =>
    model.type === "Active"
      ? activeView(model)(dispatch)
      : restView()(dispatch);
};
