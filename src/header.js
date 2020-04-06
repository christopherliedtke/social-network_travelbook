import React, { Component } from "react";
import ProfilePicture from "./profilepicture";
// import Uploader from "./uploader";
import Logout from "./logout";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <header>
                <img src="/img/logo_only.png" height="35px" alt="logo"></img>
                <div>
                    <div onClick={() => this.props.toggleModal()}>
                        <ProfilePicture
                            first={this.props.first}
                            last={this.props.last}
                            imgUrl={this.props.imgUrl}
                            width="45px"
                            height="45px"
                        />
                    </div>
                    <Logout />
                </div>
            </header>
        );
    }
}
