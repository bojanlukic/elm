import { initializeIcons } from "@fluentui/font-icons-mdl2";
import * as ElmReact from "elm-ts/lib/React";
import { render } from "react-dom";
import * as Main from "./korisnici";
import "./App.css";

initializeIcons();

const main = ElmReact.program(Main.init, Main.update, Main.view);
ElmReact.run(main, (dom) => render(dom, document.getElementById("root")!));
