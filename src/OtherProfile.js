import React, { Component } from "react";
import axios from "./axios";
import ProfilePicture from "./ProfilePicture";
import FriendButton from "./FriendButton";
import PrivateChat from "./PrivateChat";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`/user/${id}.json`).then((response) => {
            if (response.data.redirect) {
                this.props.history.push("/");
            } else {
                this.setState({
                    id: response.data.id,
                    first: response.data["first_name"],
                    last: response.data["last_name"],
                    imgUrl: response.data["image_url"],
                    bio: response.data.bio,
                    friendshipStatus: response.data.friendStatus,
                });
            }
        });
    }

    showPrivateChat() {
        this.setState({
            showPrivateChat: !this.state.showPrivateChat,
        });
    }

    render() {
        return (
            <section className="profile">
                <div className="container box">
                    <h3>
                        {this.state.first} {this.state.last}
                    </h3>
                    <div className="profile-container">
                        <div>
                            <ProfilePicture
                                first={this.state.first}
                                last={this.state.last}
                                imgUrl={this.state.imgUrl}
                                width="300px"
                            />
                        </div>
                        <div className="bio">
                            <div className="bio-txt-box">{this.state.bio}</div>
                            <FriendButton
                                otherProfileId={this.props.match.params.id}
                                updateOpenFriendRequests={() =>
                                    this.props.updateOpenFriendRequests()
                                }
                            />
                            {this.state.friendshipStatus && (
                                <button
                                    className="btn-primary"
                                    onClick={() => this.showPrivateChat()}
                                >
                                    Private Chat
                                </button>
                            )}
                            {this.state.showPrivateChat && (
                                <PrivateChat
                                    showPrivateChat={() =>
                                        this.showPrivateChat()
                                    }
                                    otherUserId={this.state.id}
                                    userId={this.props.userId}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
