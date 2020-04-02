import React, { Component } from "react";
import axios from "./axios";
import Header from "./header";

export default class App extends Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        axios
            .get("/user")
            .then(response => {
                const imgUrl =
                    response.data["image_url"] || "img/profile_default.png";
                this.setState({
                    first: response.data["first_name"],
                    last: response.data["last_name"],
                    imgUrl,
                    bio: response.data.bio
                });
            })
            .catch(err =>
                console.log(
                    "Error in conponentDidMount() on GET to /user: ",
                    err
                )
            );
    }
    updateUrl(url) {
        if (url) {
            this.setState({
                imgUrl: url
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <Header
                    first={this.state.first}
                    last={this.state.last}
                    imgUrl={this.state.imgUrl}
                    updateUrl={() => this.updateUrl()}
                />
                <section>SECTION in App</section>
            </React.Fragment>
        );
    }
}
