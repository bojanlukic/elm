import { Html } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import { Dialog, Stack, TextField } from "@fluentui/react";
import { Person } from "../api";

export type ActiveModel = { type: "Active"; original: Person };
export type SuccessModel = { type: "Success" };
export type CancelModel = { type: "Cancel" };

export type Model = ActiveModel | SuccessModel | CancelModel;

export const init = (original: Person): [Model, Cmd.Cmd<Msg>] => [
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
      minWidth={700}
      hidden={false}
      dialogContentProps={{ title: "Pregled" }}
      modalProps={{ isBlocking: true }}
      onDismiss={() => dispatch({ type: "Cancel" })}
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <TextField
          label="Ime"
          value={model.original.firstName || undefined}
          disabled={true}
        />
        <TextField
          label="Prezime"
          value={model.original.lastName || undefined}
          disabled={true}
        />
        <TextField
          label="Zanimanje"
          value={model.original.userType || undefined}
          disabled={true}
        />
        <TextField
          label="Grad"
          value={model.original.city || undefined}
          disabled={true}
        />
        <TextField
          label="Adresa"
          value={model.original.adress || undefined}
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
