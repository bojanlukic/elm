import { Html } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  IconButton,
  PrimaryButton,
  Stack,
  StackItem,
  TextField,
} from "@fluentui/react";

export type Model = {
  counter: number;
  input: string;
};

export const init: [Model, Cmd.Cmd<Msg>] = [
  { counter: 0, input: "" },
  Cmd.none,
];

export type Msg =
  | { type: "Saberi" }
  | { type: "Oduzmi" }
  | { type: "Reset" }
  | { type: "ChangeInput"; value: string }
  | { type: "Sab"; value: number }
  | { type: "Odu"; value: number };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "Saberi":
      return [{ ...model, counter: model.counter + 1 }, Cmd.none];
    case "Oduzmi":
      return [{ ...model, counter: model.counter - 1 }, Cmd.none];
    case "Reset":
      return [{ ...model, counter: 0 }, Cmd.none];
    case "ChangeInput":
      return [{ ...model, input: msg.value }, Cmd.none];
    case "Sab":
      return [{ ...model, counter: model.counter + msg.value }, Cmd.none];
    case "Odu":
      return [{ ...model, counter: model.counter - msg.value }, Cmd.none];
  }
};

export const view = (model: Model): Html<Msg> => {
  return (dispatch) => (
    <Dialog
      minWidth={500}
      hidden={false}
      dialogContentProps={{ title: "Counter" }}
      modalProps={{ isBlocking: true }}
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <DefaultButton text="+" onClick={() => dispatch({ type: "Saberi" })} />
        <DefaultButton text="-" onClick={() => dispatch({ type: "Oduzmi" })} />
        <StackItem align="center">{model.counter}</StackItem>
        <PrimaryButton
          text="Reset"
          onClick={() => dispatch({ type: "Reset" })}
        />

        <TextField
          label="Upisi broj"
          value={model.input}
          onChange={(_, newValue) =>
            dispatch({ type: "ChangeInput", value: newValue || "" })
          }
        />
      </Stack>
      <DialogFooter>
        <IconButton
          iconProps={{ iconName: "Add" }}
          onClick={() => dispatch({ type: "Sab", value: Number(model.input) })}
        />
        <IconButton
          iconProps={{ iconName: "CalculatorSubtract" }}
          onClick={() => dispatch({ type: "Odu", value: Number(model.input) })}
        />
      </DialogFooter>
    </Dialog>
  );
};
