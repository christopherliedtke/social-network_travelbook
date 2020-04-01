import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class resetpassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0
        };
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }
    submitEmail() {
        axios
            .post("/password/reset/start", {
                email: this.state.email
            })
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        step: 1,
                        error: false
                    });
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log(
                    "Error on submitEmail() in POST to /password/reset/start: ",
                    err
                );
                this.setState({
                    error: true
                });
            });
    }
    submitCode() {
        axios
            .post("/password/reset/verify", {
                email: this.state.email,
                password: this.state.password,
                code: this.state.code
            })
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        step: 2,
                        error: false
                    });
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log(
                    "Error on submitEmail() in POST to /password/reset/verify: ",
                    err
                );
                this.setState({
                    error: true
                });
            });
    }
    getCurrentDisplay() {
        const step = this.state.step;
        if (step === 0) {
            return (
                <React.Fragment>
                    {this.state.error && (
                        <div className="error">
                            Oh, something went wrong. Please try again!
                        </div>
                    )}
                    <p>Please enter your registered email address.</p>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={e => this.handleChange(e)}
                    />
                    <button
                        className="btn-primary"
                        onClick={() => this.submitEmail()}
                    >
                        Send
                    </button>
                </React.Fragment>
            );
        } else if (step === 1) {
            return (
                <React.Fragment>
                    {this.state.error && (
                        <div className="error">
                            Oh, something went wrong. Please try again!
                        </div>
                    )}
                    <p>Please enter the code you received by email.</p>
                    <input
                        name="code"
                        placeholder="code"
                        onChange={e => this.handleChange(e)}
                    />
                    <p>Please enter your new password.</p>
                    <input
                        name="password"
                        type="password"
                        placeholder="new password"
                        onChange={e => this.handleChange(e)}
                    />
                    <button
                        className="btn-primary"
                        onClick={() => this.submitCode()}
                    >
                        Send
                    </button>
                </React.Fragment>
            );
        } else if (step === 2) {
            return (
                <React.Fragment>
                    <p>
                        Your password has successfully been changed.
                        <Link to="/login">Login!</Link>
                    </p>
                </React.Fragment>
            );
        }
    }
    render() {
        return (
            <div className="password-reset">
                <h4>Reset Password</h4>
                {this.getCurrentDisplay()}
            </div>
        );
    }
}
