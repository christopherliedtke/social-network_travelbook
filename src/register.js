import React, { Component } from "react";
import axios from "axios";

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
            <div className="register">
                {this.state.error && <div className="error">Error</div>}
                <input
                    name="first"
                    placeholder="First Name"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="last"
                    placeholder="Last Name"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={e => this.handleChange(e)}
                />
                <button className="btn" onClick={() => this.submit()}>
                    Register
                </button>
            </div>
        );
    }
}
