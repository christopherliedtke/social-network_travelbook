import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import ResetPassword from "./resetpassword";

export default function Welcome() {
    return (
        <HashRouter>
            <section className="welcome">
                <div className="container">
                    <img src="img/logo_large.png" alt=""></img>
                    <p className="text-center">
                        Connect with passionate travellers around the world
                    </p>
                    <div className="box">
                        <Route exact path="/" component={Register} />
                        <Route path="/login" component={Login} />
                        <Route
                            path="/reset-password"
                            component={ResetPassword}
                        />
                    </div>
                </div>
            </section>
        </HashRouter>
    );
}
