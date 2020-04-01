import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./welcome";

ReactDOM.render(
    location.pathname == "/welcome" ? (
        <Welcome />
    ) : (
        <img src="logo_large.png" alt="logo"></img>
    ),
    document.querySelector("main")
);
