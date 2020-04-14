import React, { Component } from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import Header from "./Header";
import Uploader from "./Uploader";
import Profile from "./Profile";
import OtherProfile from "./OtherProfile";
import FindPeople from "./FindPeople";
import Friends from "./Friends";

export default class App extends Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        axios
            .get("/user")
            .then((response) => {
                const imgUrl =
                    response.data["image_url"] || "img/profile_default.png";
                this.setState({
                    first: response.data["first_name"],
                    last: response.data["last_name"],
                    imgUrl,
                    bio: response.data.bio,
                    uploaderVisible: false,
                });
            })
            .catch((err) =>
                console.log(
                    "Error in conponentDidMount() on GET to /user: ",
                    err
                )
            );
    }
    toggleModal() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }
    updateUrl(url) {
        if (url) {
            this.setState({
                imgUrl: url,
            });
        }
    }
    updateBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <Header
                        first={this.state.first}
                        last={this.state.last}
                        imgUrl={this.state.imgUrl}
                    />

                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />

                    <Route
                        path="/users"
                        render={(props) => <FindPeople key={props.match.url} />}
                    />

                    <Route
                        path="/friends"
                        render={(props) => <Friends key={props.match.url} />}
                    />

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imgUrl={this.state.imgUrl}
                                bio={this.state.bio}
                                updateUrl={(e) => this.updateUrl(e)}
                                updateBio={(e) => this.updateBio(e)}
                                toggleModal={() => this.toggleModal()}
                            />
                        )}
                    />

                    {this.state.uploaderVisible && (
                        <Uploader
                            toggleModal={() => this.toggleModal()}
                            updateUrl={(e) => this.updateUrl(e)}
                        />
                    )}
                </React.Fragment>
            </BrowserRouter>
        );
    }
}
