import { Html } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
  // Stack,
  Text,
} from "@fluentui/react";

export type ActiveModel = { type: "Active" };
export type SuccessModel = { type: "Success" };
export type CancelModel = { type: "Cancel" };

export type Model = ActiveModel | SuccessModel | CancelModel;

export const init: [Model, Cmd.Cmd<Msg>] = [{ type: "Active" }, Cmd.none];

export type Msg = { type: "Save" } | { type: "Cancel" };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "Save":
      if (model.type !== "Active") return [model, Cmd.none];
      window.alert("Korisnik je obrisan!");
      return [{ type: "Success" }, Cmd.none];

    case "Cancel":
      if (model.type !== "Active") return [model, Cmd.none];
      return [{ type: "Cancel" }, Cmd.none];
  }
};

export const activeView = (model: ActiveModel): Html<Msg> => {
  return (dispatch) => (
    <Dialog
      minWidth={500}
      hidden={false}
      dialogContentProps={{ title: "Brisanje korisnika" }}
    >
      <Text styles={{ root: { fontSize: 15 } }}>
        Da li zelite da obrisete korisnika?
      </Text>
      <DialogFooter>
        <PrimaryButton
          text="Obrisi"
          onClick={() => dispatch({ type: "Save" })}
        />
        <DefaultButton
          text="Odustani"
          onClick={() => dispatch({ type: "Cancel" })}
        />
      </DialogFooter>
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
