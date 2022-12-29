import { Html } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import {
  PrimaryButton,
  TextField,
  Stack,
  Dialog,
  DialogFooter,
} from "@fluentui/react";
import { addUser, Person } from "../api";
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

export type ActiveModel = { type: "Active"; form: Form };
export type SuccessModel = { type: "Success" };
export type CancelModel = { type: "Cancel" };

export type Model = ActiveModel | SuccessModel | CancelModel;

const initialForm = {
  firstName: null,
  lastName: null,
  userType: null,
  city: null,
  adress: null,
  createdDate: null,
};

export const init: [Model, Cmd.Cmd<Msg>] = [
  {
    type: "Active",
    form: initialForm,
  },
  Cmd.none,
];

export type Msg =
  | { type: "Save" }
  | { type: "Saved"; value: Either<HttpError, Person> }
  | { type: "Cancel" }
  | { type: "ChangeForm"; value: Form };
// | { type: "ChangeFirstName"; value: string | null }
// | { type: "ChangeLastName"; value: string | null }
// | { type: "ChangeUserType"; value: string | null }
// | { type: "ChangeCity"; value: string | null }
// | { type: "ChangeAdress"; value: string | null };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "Save": // poziva API kad se dodaje osoba
      if (model.type !== "Active") return [model, Cmd.none];
      const { adress, city, createdDate, firstName, lastName, userType } =
        model.form;
      return [
        model,
        send(
          addUser({
            id: Math.ceil(10000 * Math.random() + 10000),
            adress: adress || "",
            city: city || "",
            createdDate: createdDate || "",
            firstName: firstName || "",
            lastName: lastName || "",
            userType: userType || "",
          }),
          (value) => ({ type: "Saved", value })
        ),
      ];
    case "Saved": //// da li je prosao API ili je greska
      if (model.type !== "Active") return [model, Cmd.none];
      if (msg.value.isLeft()) {
        alert(JSON.stringify(msg.value.value));
        return [model, Cmd.none];
      }
      return [{ type: "Success" }, Cmd.none];
    case "Cancel":
      if (model.type !== "Active") return [model, Cmd.none];
      return [{ type: "Cancel" }, Cmd.none];
    case "ChangeForm":
      if (model.type !== "Active") return [model, Cmd.none];
      return [{ ...model, form: msg.value }, Cmd.none];

    // case "ChangeFirstName":
    //   return [
    //     { ...model, form: { ...model.form, firstName: msg.value } },
    //     Cmd.none,
    //   ];
    // case "ChangeLastName":
    //   return [
    //     { ...model, form: { ...model.form, lastName: msg.value } },
    //     Cmd.none,
    //   ];
    // case "ChangeUserType":
    //   return [
    //     { ...model, form: { ...model.form, userType: msg.value } },
    //     Cmd.none,
    //   ];
    // case "ChangeCity":
    //   return [{ ...model, form: { ...model.form, city: msg.value } }, Cmd.none];
    // case "ChangeAdress":
    //   return [
    //     { ...model, form: { ...model.form, adress: msg.value } },
    //     Cmd.none,
    //   ];
  }
};

export const checkSave = ({
  firstName,
  lastName,
  adress,
  userType,
  city,
  createdDate,
}: Form) =>
  firstName !== null &&
  lastName !== null &&
  createdDate !== null &&
  userType !== null &&
  city !== null &&
  adress !== null;

export const activeView = (model: ActiveModel): Html<Msg> => {
  return (dispatch) => (
    <Dialog
      minWidth={700}
      hidden={false}
      onDismiss={() => dispatch({ type: "Cancel" })}
      dialogContentProps={{ title: "Kreiranje korisnika" }}
      modalProps={{ isBlocking: true }}
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
        <TextField
          label="Datum"
          value={model.form.createdDate || undefined}
          onChange={(_, newValue) =>
            dispatch({
              type: "ChangeForm",
              value: { ...model.form, createdDate: newValue || null },
            })
          }
        />
      </Stack>
      <DialogFooter>
        <PrimaryButton
          text="Dodaj"
          onClick={() => dispatch({ type: "Save" })}
          disabled={!checkSave(model.form)}
        />
      </DialogFooter>
    </Dialog>
  );
};

export const restView = (): Html<Msg> => (_dispatch) => <></>;

export const view =
  (model: Model): Html<Msg> =>
  (dispatch) =>
    model.type === "Active"
      ? activeView(model)(dispatch)
      : restView()(dispatch);
