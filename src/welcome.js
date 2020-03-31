import React from "react";
import Register from "./register";

export default function Welcome() {
    return (
        <div className="container">
            <h1>[Social Network]</h1>
            <p>Join now!!!</p>
            <img src="logo.png" alt=""></img>
            <Register />
        </div>
    );
}
