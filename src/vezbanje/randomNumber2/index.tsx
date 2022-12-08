import { Dialog, PrimaryButton, Stack, StackItem } from "@fluentui/react";
import * as Cmd from "elm-ts/lib/Cmd";
import { Html } from "elm-ts/lib/React";
import { getRandomNumber } from "./randomEffect";

export type Model = {
  random: number | null;
};
export const init: [Model, Cmd.Cmd<Msg>] = [{ random: 0 }, Cmd.none];

export type Msg = { type: "Start" } | { type: "RandomNumber"; value: number };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "Start":
      return [
        model,
        getRandomNumber((value) => ({ type: "RandomNumber", value })),
      ];
    case "RandomNumber":
      return [{ ...model, random: msg.value }, Cmd.none];
  }
};

export const view = (model: Model): Html<Msg> => {
  return (dispatch) => (
    <Dialog
      minWidth={300}
      hidden={false}
      dialogContentProps={{
        title: "Random Broj",
      }}
      modalProps={{ isBlocking: true }}
    >
      <Stack tokens={{ childrenGap: 15 }}>
        <PrimaryButton
          text="Nadji broj"
          onClick={() => dispatch({ type: "Start" })}
        />
        <StackItem align="center"> {model.random}</StackItem>
      </Stack>
    </Dialog>
  );
};
