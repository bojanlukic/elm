import { Html } from "elm-ts/lib/React";
import * as Cmd from "elm-ts/lib/Cmd";
import { getRandomNumber } from "./randomNumberEffect";
import { DefaultButton } from "@fluentui/react";

export type Model = {
  random: number | null;
  random2: number | null;
  random3: number | null;
  random4: number | null;
};
export const init: [Model, Cmd.Cmd<Msg>] = [
  { random: null, random2: null, random3: null, random4: null },
  Cmd.none,
];

export type Msg =
  | { type: "StartFour" }
  | { type: "StartThree" }
  | { type: "StartBoth" }
  | { type: "StartRandomNumber" }
  | { type: "RandomNumber"; value: number }
  | { type: "StartRandomNumber2" }
  | { type: "RandomNumber2"; value: number }
  | { type: "RandomNumber3"; value: number }
  | { type: "RandomNumber4"; value: number };

export const update = (msg: Msg, model: Model): [Model, Cmd.Cmd<Msg>] => {
  switch (msg.type) {
    case "StartFour":
      return [
        model,
        Cmd.batch<Msg>([
          getRandomNumber((value) => ({ type: "RandomNumber", value })),
          getRandomNumber((value) => ({ type: "RandomNumber2", value })),
          getRandomNumber((value) => ({ type: "RandomNumber3", value })),
          getRandomNumber((value) => ({ type: "RandomNumber4", value })),
        ]),
      ];
    case "StartThree":
      return [
        model,
        Cmd.batch<Msg>([
          getRandomNumber((value) => ({ type: "RandomNumber", value })),
          getRandomNumber((value) => ({ type: "RandomNumber2", value })),
          getRandomNumber((value) => ({ type: "RandomNumber3", value })),
        ]),
      ];
    case "StartBoth":
      return [
        model,
        Cmd.batch<Msg>([
          getRandomNumber((value) => ({ type: "RandomNumber", value })),
          getRandomNumber((value) => ({ type: "RandomNumber2", value })),
        ]),
      ];
    case "StartRandomNumber":
      return [
        model,
        getRandomNumber((value) => ({ type: "RandomNumber", value })),
      ];
    case "RandomNumber":
      return [{ ...model, random: msg.value }, Cmd.none];
    case "StartRandomNumber2":
      return [
        model,
        getRandomNumber((value) => ({ type: "RandomNumber2", value })),
      ];
    case "RandomNumber2":
      return [{ ...model, random2: msg.value }, Cmd.none];
    case "RandomNumber3":
      return [{ ...model, random3: msg.value }, Cmd.none];
    case "RandomNumber4":
      return [{ ...model, random4: msg.value }, Cmd.none];
  }
};

export const view = (model: Model): Html<Msg> => {
  return (dispatch) => (
    <>
      <DefaultButton
        text="Find four numbers"
        onClick={() => dispatch({ type: "StartFour" })}
      />
      <DefaultButton
        text="Find three numbers"
        onClick={() => dispatch({ type: "StartThree" })}
      />
      <DefaultButton
        text="Find both numbers"
        onClick={() => dispatch({ type: "StartBoth" })}
      />
      <DefaultButton
        text="Find number"
        onClick={() => dispatch({ type: "StartRandomNumber" })}
      />
      <DefaultButton
        text="Find number"
        onClick={() => dispatch({ type: "StartRandomNumber2" })}
      />
      <h1>{model.random || ""}</h1>
      <h1>{model.random2 || ""}</h1>
      <h1>{model.random3 || ""}</h1>
      <h1>{model.random4 || ""}</h1>
    </>
  );
};
