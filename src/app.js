import React, { Component } from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import Header from "./Header";
import Uploader from "./Uploader";
import Profile from "./Profile";
import OtherProfile from "./OtherProfile";
import FindPeople from "./FindPeople";
import Friends from "./Friends";
import Chat from "./Chat";

export default class App extends Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        axios
            .get("/user")
            .then((response) => {
                const imgUrl = response.data["image_url"];
                this.setState({
                    id: response.data.id,
                    first: response.data["first_name"],
                    last: response.data["last_name"],
                    imgUrl,
                    bio: response.data.bio,
                    openFriendRequests: parseInt(response.data.count),
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

    updateOpenFriendRequests() {
        this.setState({
            openFriendRequests: this.state.openFriendRequests - 1,
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
                        openFriendRequests={this.state.openFriendRequests}
                    />

                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                                updateOpenFriendRequests={() =>
                                    this.updateOpenFriendRequests()
                                }
                                userId={this.state.id}
                            />
                        )}
                    />

                    <Route
                        path="/users"
                        render={(props) => <FindPeople key={props.match.url} />}
                    />

                    <Route
                        path="/friends"
                        render={(props) => (
                            <Friends
                                key={props.match.url}
                                updateOpenFriendRequests={() =>
                                    this.updateOpenFriendRequests()
                                }
                            />
                        )}
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

                    <Route
                        exact
                        path="/chat"
                        render={() => <Chat userId={this.state.id} />}
                    />

                    {this.state.uploaderVisible && (
                        <Uploader
                            imageUrl={this.state.imgUrl}
                            toggleModal={() => this.toggleModal()}
                            updateUrl={(e) => this.updateUrl(e)}
                        />
                    )}
                </React.Fragment>
            </BrowserRouter>
        );
    }
}
