import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./Welcome";
import App from "./App";

ReactDOM.render(
    location.pathname == "/welcome" ? <Welcome /> : <App />,
    document.querySelector("main")
);
