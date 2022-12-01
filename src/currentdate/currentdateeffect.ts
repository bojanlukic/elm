import * as Cmd from 'elm-ts/lib/Cmd';
import { Task, perform } from 'elm-ts/lib/Task';

export const getCurrentDate = <Msg>(fn: (date: Date) => Msg): Cmd.Cmd<Msg> => perform(
    new Task(() => Promise.resolve(new Date())),
    fn
)


// const customMap = (fn: (value: number) => number, arr: Array<number>): Array<number> => {
//     const temp = [];
//     let i = 0;
//     while (arr.length > i) {
//         temp.push(fn(arr[i]))
//         i++;
//     }
//     return temp;
// }


// customMap(x => x * 2, [1, 2, 3, 4, 5, 6])


// Zadatak

/*

1. Model = { kockica: number, kockica2: number }

*/