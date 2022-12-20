import { send, HttpError } from "elm-ts/lib/Http";
import { Html, map as HtmlMap } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import { Either } from "fp-ts/lib/Either";
import {
  IconButton,
  Stack,
  IColumn,
  DetailsList,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import * as Kreiranje from "./kreiranje";
import * as Azuriranje from "./azuriranje";
import * as Brisanje from "./brisanje";
import * as Pregled from "./pregled";
import { fetchUser, Persons, Person } from "./api";
import moment from "moment";
import { act } from "react-dom/test-utils";

export type ActiveModel = {
  type: "Active";
  data: Persons | null;
  selected: Person | null;
  kreiranje?: Kreiranje.Model;
  azuriranje?: Azuriranje.Model;
  brisanje?: Brisanje.Model;
  pregled?: Pregled.Model;
};

export type LoadingModel = { type: "Loading" };

export type Model = ActiveModel | LoadingModel;

export const init: [Model, Cmd.Cmd<Msg>] = [
  { type: "Loading" },
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
  | { type: "Brisanje"; value: Brisanje.Msg }
  | { type: "Refresh" }
  | { type: "StartPregled" }
  | { type: "Pregled"; value: Pregled.Msg };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "FetchUser": {
      if (model.type !== "Loading") return [model, Cmd.none];
      return msg.data.fold(
        (error) => {
          alert(error);
          return [model, Cmd.none];
        },
        (data) => [{ type: "Active", selected: null, data } as Model, Cmd.none]
      );
    }
    case "ChangeSelected":
      if (model.type !== "Active") return [model, Cmd.none];
      console.log("model =", model);
      console.log("selected =", msg.value);
      return [{ ...model, selected: msg.value }, Cmd.none];

    case "StartKreiranje":
      if (model.type !== "Active") return [model, Cmd.none];
      const [kreiranjeModel, kreiranjeMsg] = Kreiranje.init;
      return [
        { ...model, kreiranje: kreiranjeModel },
        Cmd.map(kreiranjeMsg, (value) => ({ type: "Kreiranje", value })),
      ];

    case "Kreiranje": {
      if (model.type !== "Active") return [model, Cmd.none];
      if (model.kreiranje === undefined) return [model, Cmd.none];
      const [kreiranjeModel, kreiranjeMsg] = Kreiranje.update(
        msg.value,
        model.kreiranje
      );
      if (kreiranjeModel.type === "Success") return init;
      if (kreiranjeModel.type === "Cancel")
        return [{ ...model, kreiranje: undefined }, Cmd.none];
      return [
        { ...model, kreiranje: kreiranjeModel },
        Cmd.map(kreiranjeMsg, (value) => ({ type: "Kreiranje", value })),
      ];
    }
    case "StartAzuriranje":
      if (model.type !== "Active") return [model, Cmd.none];
      if (model.selected === null) return [model, Cmd.none];
      const [azuriranjeModel, azuriranjeMsg] = Azuriranje.init(model.selected);
      return [
        { ...model, azuriranje: azuriranjeModel },
        Cmd.map(azuriranjeMsg, (value) => ({ type: "Azuriranje", value })),
      ];

    case "Azuriranje": {
      if (model.type !== "Active") return [model, Cmd.none];
      if (model.azuriranje === undefined) return [model, Cmd.none];
      const [azuriranjeModel, azuriranjeMsg] = Azuriranje.update(
        msg.value,
        model.azuriranje
      );
      if (azuriranjeModel.type === "Success") return init;
      if (azuriranjeModel.type === "Cancel")
        return [{ ...model, azuriranje: undefined }, Cmd.none];
      return [
        { ...model, azuriranje: azuriranjeModel },
        Cmd.map(azuriranjeMsg, (value) => ({ type: "Azuriranje", value })),
      ];
    }
    case "StartBrisanje":
      if (model.type !== "Active") return [model, Cmd.none];
      const [brisanjeModel, brisanjeMsg] = Brisanje.init;
      return [
        { ...model, brisanje: brisanjeModel },
        Cmd.map(brisanjeMsg, (value) => ({ type: "Brisanje", value })),
      ];
    case "Brisanje": {
      if (model.type !== "Active") return [model, Cmd.none];
      if (model.brisanje === undefined) return [model, Cmd.none];
      if (model.selected === null) return [model, Cmd.none];
      const [brisanjeModel, brisanjeMsg] = Brisanje.update(
        model.selected.id,
        msg.value,
        model.brisanje
      );
      if (brisanjeModel.type === "Success") return init;
      if (brisanjeModel.type === "Cancel")
        return [{ ...model, brisanje: undefined }, Cmd.none];
      return [
        { ...model, brisanje: brisanjeModel },
        Cmd.map(brisanjeMsg, (value) => ({ type: "Brisanje", value })),
      ];
    }
    case "Refresh": {
      if (model.type !== "Active") return [model, Cmd.none];
      return init;
    }
    case "StartPregled":
      if (model.type !== "Active") return [model, Cmd.none];
      if (model.selected === null) return [model, Cmd.none];
      const [pregledModel, pregledMsg] = Pregled.init(model.selected);
      return [
        { ...model, pregled: pregledModel },
        Cmd.map(pregledMsg, (value) => ({ type: "Pregled", value })),
      ];

    case "Pregled": {
      if (model.type !== "Active") return [model, Cmd.none];
      if (model.pregled === undefined) return [model, Cmd.none];
      const [pregledModel, pregledMsg] = Pregled.update(
        msg.value,
        model.pregled
      );
      if (pregledModel.type === "Success") return init;
      if (pregledModel.type === "Cancel")
        return [{ ...model, pregled: undefined }, Cmd.none];
      return [
        { ...model, pregled: pregledModel },
        Cmd.map(pregledMsg, (value) => ({ type: "Pregled", value })),
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

export const activeView = (model: ActiveModel): Html<Msg> => {
  const { selected, data, kreiranje, azuriranje, brisanje, pregled } = model;
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
        <IconButton
          iconProps={{ iconName: "Refresh" }}
          onClick={() => dispatch({ type: "Refresh" })}
        />
        <IconButton
          iconProps={{ iconName: "TextDocument" }}
          onClick={() => dispatch({ type: "StartPregled" })}
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

      {pregled &&
        HtmlMap(
          Pregled.view(pregled),
          (value) => ({ type: "Pregled", value } as Msg)
        )(dispatch)}

      {brisanje &&
        HtmlMap(
          Brisanje.view(brisanje),
          (value) => ({ type: "Brisanje", value } as Msg)
        )(dispatch)}
    </Stack>
  );
};

export const loadingView = (_model: LoadingModel): Html<Msg> => {
  return (_dispatch) => (
    <Stack grow={1} styles={{ root: { height: "90vh", width: "98vw" } }}>
      <Stack
        horizontal={true}
        horizontalAlign="end"
        tokens={{ childrenGap: 10 }}
      >
        <IconButton iconProps={{ iconName: "Add" }} disabled={true} />
        <IconButton iconProps={{ iconName: "Edit" }} disabled={true} />
        <IconButton iconProps={{ iconName: "Delete" }} disabled={true} />
        <IconButton iconProps={{ iconName: "Refresh" }} disabled={true} />
        <IconButton iconProps={{ iconName: "TextDocument" }} disabled={true} />
      </Stack>
      <Stack grow={1} horizontalAlign="center" verticalAlign="center">
        <Spinner size={SpinnerSize.large} />
      </Stack>
    </Stack>
  );
};

export const view =
  (model: Model): Html<Msg> =>
  (dispatch) =>
    model.type === "Active"
      ? activeView(model)(dispatch)
      : loadingView(model)(dispatch);
