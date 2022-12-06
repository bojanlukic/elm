import { Html, map as HtmlMap } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import { IconButton, Stack } from "@fluentui/react";
import * as Kreiranje from "./kreiranje";

export type Model = {
  kreiranje?: Kreiranje.Model;
};

export const init: [Model, Cmd.Cmd<Msg>] = [{}, Cmd.none];

export type Msg =
  | { type: "StartKreiranje" }
  | { type: "Kreiranje"; value: Kreiranje.Msg };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "StartKreiranje": {
      const [kreiranjeModel, kreiranjeMsg] = Kreiranje.init;
      return [
        { kreiranje: kreiranjeModel },
        Cmd.map(kreiranjeMsg, (value) => ({ type: "Kreiranje", value })),
      ];
    }
    case "Kreiranje": {
      if (model.kreiranje === undefined) return [model, Cmd.none];
      const [kreiranjeModel, kreiranjeMsg] = Kreiranje.update(
        msg.value,
        model.kreiranje
      );
      if (kreiranjeModel.type !== "Active") return [{}, Cmd.none];
      return [
        { kreiranje: kreiranjeModel },
        Cmd.map(kreiranjeMsg, (value) => ({ type: "Kreiranje", value })),
      ];
    }
  }
};

export const view = (model: Model): Html<Msg> => {
  return (dispatch) => (
    <Stack>
      <IconButton
        iconProps={{ iconName: "Add" }}
        onClick={() => dispatch({ type: "StartKreiranje" })}
      />
      {model.kreiranje &&
        HtmlMap(
          Kreiranje.view(model.kreiranje),
          (value) => ({ type: "Kreiranje", value } as Msg)
        )(dispatch)}
    </Stack>
  );
};
