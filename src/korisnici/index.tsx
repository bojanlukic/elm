import { Html, map as HtmlMap } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import { IconButton, Stack } from "@fluentui/react";
import * as Kreiranje from "./kreiranje";
import * as Azuriranje from "./azuriranje";

export type Model = {
  kreiranje?: Kreiranje.Model; // indikator da li je pokrenuta komponenta
  azuriranje?: Azuriranje.Model;
};

export const init: [Model, Cmd.Cmd<Msg>] = [{}, Cmd.none];

export type Msg =
  | { type: "StartKreiranje" }
  | { type: "Kreiranje"; value: Kreiranje.Msg }
  | { type: "StartAzuriranje" }
  | { type: "Azuriranje"; value: Azuriranje.Msg };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "StartAzuriranje":
      const [azuriranjeModel, azuriranjeMsg] = Azuriranje.init;
      return [
        { azuriranje: azuriranjeModel },
        Cmd.map(azuriranjeMsg, (value) => ({ type: "Azuriranje", value })),
      ];

    case "Azuriranje": {
      if (model.azuriranje === undefined) return [model, Cmd.none];
      const [azuriranjeModel, azuriranjeMsg] = Azuriranje.update(
        msg.value,
        model.azuriranje
      );
      if (azuriranjeModel.type !== "Active") return [{}, Cmd.none];
      return [
        { azuriranje: azuriranjeModel },
        Cmd.map(azuriranjeMsg, (value) => ({ type: "Azuriranje", value })),
      ];
    }
    case "StartKreiranje":
      const [kreiranjeModel, kreiranjeMsg] = Kreiranje.init;
      return [
        { kreiranje: kreiranjeModel },
        Cmd.map(kreiranjeMsg, (value) => ({ type: "Kreiranje", value })),
      ];

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
    <Stack style={{ display: "flex", flexDirection: "row" }}>
      <IconButton
        iconProps={{ iconName: "Add" }}
        onClick={() => dispatch({ type: "StartKreiranje" })}
      />
      <IconButton
        iconProps={{ iconName: "Edit" }}
        onClick={() => dispatch({ type: "StartAzuriranje" })}
      />
      <IconButton
        iconProps={{ iconName: "Delete" }}
        onClick={() => dispatch({ type: "StartBrisanje" })}
      />
      {model.kreiranje &&
        HtmlMap(
          Kreiranje.view(model.kreiranje),
          (value) => ({ type: "Kreiranje", value } as Msg)
        )(dispatch)}
      {model.azuriranje &&
        HtmlMap(
          Azuriranje.view(model.azuriranje),
          (value) => ({ type: "Azuriranje", value } as Msg)
        )(dispatch)}
    </Stack>
  );
};
