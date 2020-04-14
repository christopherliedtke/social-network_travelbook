import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import reducer from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

import Welcome from "./Welcome";
import App from "./App";

ReactDOM.render(
    location.pathname == "/welcome" ? (
        <Welcome />
    ) : (
        <Provider store={store}>
            <App />
        </Provider>
    ),
    document.querySelector("main")
);
