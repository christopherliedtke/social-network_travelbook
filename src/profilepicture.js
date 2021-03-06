import React, { Component } from "react";

export default class ProfilePicture extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const fullName = this.props.first + " " + this.props.last;
        return (
            <React.Fragment>
                <img
                    className="profile-pic"
                    src={this.props.imgUrl || "/img/profile_default.png"}
                    height={this.props.height}
                    width={this.props.width}
                    alt={fullName}
                ></img>
            </React.Fragment>
        );
    }
}
