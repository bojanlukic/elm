import { Html } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import { DefaultButton } from "@fluentui/react";
import { getCurrentDate } from "./currentdateeffect";

// --- Model
export type Model = Date | null;

// export const init = (): [Model, Cmd.Cmd<Msg>] => [null, getCurrentDate(date => ({ type: 'CurrentDate', value: date }))]
export const init: [Model, Cmd.Cmd<Msg>] = [
  null,
  getCurrentDate((date) => ({ type: "CurrentDate", value: date })),
];

// --- Messages
export type Msg =
  | { type: "StartCurrentDate" }
  | { type: "CurrentDate"; value: Date };

// --- Update
export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "StartCurrentDate":
      return [
        model,
        getCurrentDate((date) => ({ type: "CurrentDate", value: date })),
      ];
    case "CurrentDate":
      return [msg.value, Cmd.none];
  }
};

// --- View
export const view = (model: Model): Html<Msg> => {
  return (dispatch) => (
    <div>
      <pre>{JSON.stringify(model, null, 2)}</pre>
      <DefaultButton
        text="Get current Date"
        onClick={() => dispatch({ type: "StartCurrentDate" })}
      />
    </div>
  );
};
