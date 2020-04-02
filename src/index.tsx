import * as React from "react";
import { render } from "react-dom";

import App from "./App";
import { lineNumber } from "./LineNumber";

lineNumber();
const rootElement = document.getElementById("root");
render(<App />, rootElement);
