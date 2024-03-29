import { Html } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import deepEqual from "fast-deep-equal";
import {
  Dialog,
  DialogFooter,
  PrimaryButton,
  Stack,
  TextField,
} from "@fluentui/react";
import { editUser, Person } from "../api";
import { Either } from "fp-ts/lib/Either";
import { send, HttpError } from "elm-ts/lib/Http";

export type Form = {
  firstName: string | null;
  lastName: string | null;
  userType: string | null;
  city: string | null;
  adress: string | null;
  createdDate: string | null;
};

export type ActiveModel = { type: "Active"; form: Form; original: Person };
export type SuccessModel = { type: "Success" };
export type CancelModel = { type: "Cancel" };

export type Model = ActiveModel | SuccessModel | CancelModel;

const initialForm = ({
  firstName,
  lastName,
  userType,
  adress,
  city,
  createdDate,
}: Person) => ({
  firstName,
  lastName,
  userType,
  city,
  adress,
  createdDate,
});

export const init = (original: Person): [Model, Cmd.Cmd<Msg>] => [
  {
    type: "Active",
    form: initialForm(original),
    original,
  },
  Cmd.none,
];

export type Msg =
  | { type: "ChangeForm"; value: Form }
  | { type: "Cancel" }
  | { type: "Save" }
  | { type: "Saved"; value: Either<HttpError, Person> };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "ChangeForm":
      if (model.type !== "Active") return [model, Cmd.none];
      return [{ ...model, form: msg.value }, Cmd.none];
    case "Cancel":
      if (model.type !== "Active") return [model, Cmd.none];
      return [{ type: "Cancel" }, Cmd.none];

    case "Save": {
      if (model.type !== "Active") return [model, Cmd.none];
      const {
        form: { adress, city, createdDate, firstName, lastName, userType },
        original: { id },
      } = model;
      return [
        model,
        send(
          editUser({
            id,
            firstName: firstName || "",
            lastName: lastName || "",
            userType: userType || "",
            city: city || "",
            adress: adress || "",
            createdDate: createdDate || "",
          }),
          (response) => ({ type: "Saved", value: response })
        ),
      ];
    }
    case "Saved":
      if (model.type !== "Active") return [model, Cmd.none];
      if (msg.value.isLeft()) {
        alert(JSON.stringify(msg.value.value));
        return [model, Cmd.none];
      }
      return [{ type: "Success" }, Cmd.none];
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
      dialogContentProps={{ title: "Azuriranje" }}
      modalProps={{ isBlocking: true }}
      onDismiss={() => dispatch({ type: "Cancel" })}
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <TextField
          label="Ime"
          value={model.form.firstName || undefined}
          onChange={(_, newValue) =>
            dispatch({
              type: "ChangeForm",
              value: { ...model.form, firstName: newValue || null },
            })
          }
        />
        <TextField
          label="Prezime"
          value={model.form.lastName || undefined}
          onChange={(_, newValue) =>
            dispatch({
              type: "ChangeForm",
              value: { ...model.form, lastName: newValue || null },
            })
          }
        />
        <TextField
          label="Zanimanje"
          value={model.form.userType || undefined}
          onChange={(_, newValue) =>
            dispatch({
              type: "ChangeForm",
              value: { ...model.form, userType: newValue || null },
            })
          }
        />
        <TextField
          label="Grad"
          value={model.form.city || undefined}
          onChange={(_, newValue) =>
            dispatch({
              type: "ChangeForm",
              value: { ...model.form, city: newValue || null },
            })
          }
        />
        <TextField
          label="Adresa"
          value={model.form.adress || undefined}
          onChange={(_, newValue) =>
            dispatch({
              type: "ChangeForm",
              value: { ...model.form, adress: newValue || null },
            })
          }
        />
      </Stack>
      <DialogFooter>
        <PrimaryButton
          text="Sacuvaj"
          disabled={deepEqual(initialForm(model.original), model.form)}
          onClick={() => dispatch({ type: "Save" })}
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
