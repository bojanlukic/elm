import { send, HttpError } from "elm-ts/lib/Http";
import { Html, map as HtmlMap } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import { Either } from "fp-ts/lib/Either";
import { IconButton, Stack, IColumn, DetailsList } from "@fluentui/react";
import * as Kreiranje from "./kreiranje";
import * as Azuriranje from "./azuriranje";
import * as Brisanje from "./brisanje";
import { fetchUser, Persons, Person } from "./api";
import moment from "moment";

export type Model = {
  data: Persons | null;
  selected: Person | null;
  kreiranje?: Kreiranje.Model; // indikator da li je pokrenuta komponenta
  azuriranje?: Azuriranje.Model;
  brisanje?: Brisanje.Model;
};

export const init: [Model, Cmd.Cmd<Msg>] = [
  { data: [], selected: null },
  send(fetchUser(), (response) => ({ type: "FetchUser", data: response })),
];

export type Msg =
  | { type: "FetchUser"; data: Either<HttpError, Persons> }
  | { type: "ChangeSelected"; value: Person | null }
  | { type: "StartKreiranje" }
  | { type: "Kreiranje"; value: Kreiranje.Msg }
  | { type: "StartAzuriranje" }
  | { type: "Azuriranje"; value: Azuriranje.Msg }
  | { type: "StartBrisanje" }
  | { type: "Brisanje"; value: Brisanje.Msg };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "FetchUser": {
      return msg.data.fold(
        (error) => {
          alert(error);
          return [model, Cmd.none];
        },
        (data) => [{ ...model, data }, Cmd.none]
      );
    }
    case "ChangeSelected":
      console.log("model =", model);
      console.log("selected =", msg.value);
      return [{ ...model, selected: msg.value }, Cmd.none];
    case "StartKreiranje":
      const [kreiranjeModel, kreiranjeMsg] = Kreiranje.init;
      return [
        { ...model, kreiranje: kreiranjeModel },
        Cmd.map(kreiranjeMsg, (value) => ({ type: "Kreiranje", value })),
      ];

    case "Kreiranje": {
      if (model.kreiranje === undefined) return [model, Cmd.none];
      const [kreiranjeModel, kreiranjeMsg] = Kreiranje.update(
        msg.value,
        model.kreiranje
      );
      if (kreiranjeModel.type === "Success") return init;
      if (kreiranjeModel.type === "Cancel")
        return [{ ...model, kreiranje: undefined }, Cmd.none]; ///???
      return [
        { ...model, kreiranje: kreiranjeModel },
        Cmd.map(kreiranjeMsg, (value) => ({ type: "Kreiranje", value })),
      ];
    }
    case "StartAzuriranje":
      if (model.selected === null) return [model, Cmd.none];
      const [azuriranjeModel, azuriranjeMsg] = Azuriranje.init(model.selected);
      return [
        { ...model, azuriranje: azuriranjeModel },
        Cmd.map(azuriranjeMsg, (value) => ({ type: "Azuriranje", value })),
      ];

    case "Azuriranje": {
      if (model.azuriranje === undefined) return [model, Cmd.none];
      const [azuriranjeModel, azuriranjeMsg] = Azuriranje.update(
        msg.value,
        model.azuriranje
      );
      if (azuriranjeModel.type !== "Active")
        return [{ ...model, azuriranje: undefined }, Cmd.none];
      return [
        { ...model, azuriranje: azuriranjeModel },
        Cmd.map(azuriranjeMsg, (value) => ({ type: "Azuriranje", value })),
      ];
    }
    case "StartBrisanje":
      const [brisanjeModel, brisanjeMsg] = Brisanje.init;
      return [
        { ...model, brisanje: brisanjeModel },
        Cmd.map(brisanjeMsg, (value) => ({ type: "Brisanje", value })),
      ];
    case "Brisanje": {
      if (model.brisanje === undefined) return [model, Cmd.none];
      const [brisanjeModel, brisanjeMsg] = Brisanje.update(
        msg.value,
        model.brisanje
      );
      if (brisanjeModel.type !== "Active")
        return [{ ...model, brisanje: undefined }, Cmd.none];
      return [
        { ...model, brisanje: brisanjeModel },
        Cmd.map(brisanjeMsg, (value) => ({ type: "Brisanje", value })),
      ];
    }
  }
};

const columns: IColumn[] = [
  {
    key: "firstname",
    name: "Ime",
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: Person) => <div>{item.firstName}</div>,
  },
  {
    key: "lastname",
    name: "Prezime",
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: Person) => <div>{item.lastName}</div>,
  },
  {
    key: "userType",
    name: "Zanimanje",
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: Person) => <div>{item.userType}</div>,
  },
  {
    key: "date",
    name: "Datum",
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: Person) => (
      <div>{moment(item.createdDate).format("MM/DD/YYYY")}</div>
    ),
  },
  {
    key: "city",
    name: "Grad",
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: Person) => <div>{item.city}</div>,
  },
  {
    key: "adress",
    name: "Adresa",
    minWidth: 100,
    maxWidth: 100,
    onRender: (item: Person) => <div>{item.adress}</div>,
  },
];

export const view = (model: Model): Html<Msg> => {
  const { selected, data, kreiranje, azuriranje, brisanje } = model;
  return (dispatch) => (
    <Stack grow={1}>
      <Stack
        grow={1}
        horizontal={true}
        horizontalAlign="end"
        tokens={{ childrenGap: 10 }}
      >
        <IconButton
          iconProps={{ iconName: "Add" }}
          onClick={() => dispatch({ type: "StartKreiranje" })}
        />

        <IconButton
          iconProps={{ iconName: "Edit" }}
          onClick={() => dispatch({ type: "StartAzuriranje" })}
          disabled={!selected}
        />

        <IconButton
          iconProps={{ iconName: "Delete" }}
          onClick={() => dispatch({ type: "StartBrisanje" })}
          disabled={!selected}
        />
      </Stack>

      <DetailsList
        items={data || []}
        columns={columns}
        onActiveItemChanged={(item) =>
          dispatch({ type: "ChangeSelected", value: item })
        }
      />
      {kreiranje &&
        HtmlMap(
          Kreiranje.view(kreiranje),
          (value) => ({ type: "Kreiranje", value } as Msg)
        )(dispatch)}

      {azuriranje &&
        HtmlMap(
          Azuriranje.view(azuriranje),
          (value) => ({ type: "Azuriranje", value } as Msg)
        )(dispatch)}

      {brisanje &&
        HtmlMap(
          Brisanje.view(brisanje),
          (value) => ({ type: "Brisanje", value } as Msg)
        )(dispatch)}
    </Stack>
  );
};
