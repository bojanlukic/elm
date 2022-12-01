import { Html } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import { DefaultButton, TextField } from "@fluentui/react";

export type Model = {
  firstName: string;
  lastName: string;
  userType: string;
  city: string;
  adress: string;
  createdDate: Date;
};

export const init: [Model, Cmd.Cmd<Msg>] = [
  {
    firstName: "",
    lastName: "",
    userType: "",
    city: "",
    adress: "",
    createdDate: new Date,
  },
  Cmd.none,
];

export type Msg = { type: "FetchUsers" };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {

};

export const view = (model: Model): Html<Msg> => {
  return (dispatch) => (
    <div>
      <DefaultButton
        text="Start"
        onClick={() => dispatch({ type: "FetchUsers" })}
      />
    </div>
  );
};
