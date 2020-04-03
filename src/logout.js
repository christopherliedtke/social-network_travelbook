import React, { Component } from "react";
import axios from "./axios";

export default class Logout extends Component {
    constructor() {
        super();
        this.state = {};
    }
    logout() {
        axios
            .get("/logout")
            .then(() => {
                location.replace("/");
            })
            .catch(err => {
                console.log("Error in /logout: ", err);
            });
    }
    render() {
        return (
            <div onClick={() => this.logout()} className="logout">
                <i className="fas fa-sign-out-alt fa-lg"></i>
            </div>
        );
    }
}
