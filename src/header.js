import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import Logout from "./Logout";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <header>
                <div>
                    <Link to="/">
                        <img
                            src="/img/logo_only.png"
                            height="35px"
                            alt="logo"
                        ></img>
                    </Link>
                </div>
                <div></div>
                <div>
                    <nav>
                        <Link className="nav-link" to="/users">
                            Find People
                        </Link>
                        <Link className="nav-link" to="/chat">
                            Chat
                        </Link>
                        <Link className="nav-link" to="/friends">
                            Friends
                            {this.props.openFriendRequests > 0 ? (
                                <span className="badge badge-secondary">
                                    {this.props.openFriendRequests}
                                </span>
                            ) : null}
                        </Link>
                    </nav>
                    <Link to="/">
                        <div>
                            <ProfilePicture
                                first={this.props.first}
                                last={this.props.last}
                                imgUrl={this.props.imgUrl}
                                width="45px"
                                height="45px"
                            />
                        </div>
                    </Link>
                    <Logout />
                </div>
            </header>
        );
    }
}
