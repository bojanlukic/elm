import * as Cmd from "elm-ts/lib/Cmd";
import { Task, perform } from "elm-ts/lib/Task";

export const getRandomNumber = <Msg>(
  fn: (random: number) => Msg
): Cmd.Cmd<Msg> =>
  perform(
    new Task(() => Promise.resolve(Math.floor(Math.random() * 6) + 1)),
    fn
  );
