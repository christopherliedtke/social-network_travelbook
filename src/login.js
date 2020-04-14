import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password,
            })
            .then((res) => {
                if (res.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("Error on submit() in POST to /login: ", err);
                this.setState({
                    error: true,
                });
            });
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    render() {
        return (
            <React.Fragment>
                <h4>Login</h4>
                {this.state.error && (
                    <div className="error">
                        Oh, something went wrong. Please try again!
                    </div>
                )}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button className="btn-primary" onClick={() => this.submit()}>
                    Log in
                </button>
                <p>
                    Not a member? <Link to="/">Register!</Link>
                </p>
                <Link to="/reset-password">Forgot password?</Link>
            </React.Fragment>
        );
    }
}
