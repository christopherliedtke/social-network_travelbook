import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import reducer from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { init } from "./socket";
import Welcome from "./Welcome";
import App from "./App";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let component;
if (location.pathname == "/welcome") {
    component = <Welcome />;
} else {
    init(store);
    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}
ReactDOM.render(component, document.querySelector("main"));
