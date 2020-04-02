import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/register", {
                firstName: this.state.first,
                lastName: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(res => {
                if (res.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("Error on submit() in POST to /register: ", err);
                this.setState({
                    error: true
                });
            });
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }

    render() {
        return (
            <React.Fragment>
                <h4>Register</h4>
                {this.state.error && (
                    <div className="error">
                        Oh, something went wrong. Please try again!
                    </div>
                )}
                <input
                    name="first"
                    placeholder="First Name"
                    autoComplete="given-name"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="last"
                    placeholder="Last Name"
                    autoComplete="family-name"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    onChange={e => this.handleChange(e)}
                />
                <button className="btn-primary" onClick={() => this.submit()}>
                    Register
                </button>
                <p>
                    Already a member? <Link to="/login">Log in!</Link>
                </p>
            </React.Fragment>
        );
    }
}
