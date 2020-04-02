import React, { Component } from "react";
import ProfilePicture from "./profilepicture";
import Uploader from "./uploader";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false
        };
    }
    toggleModal() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible
        });
    }
    render() {
        return (
            <header>
                <img src="img/logo_only.png" height="35px" alt="logo"></img>
                <div onClick={() => this.toggleModal()}>
                    <ProfilePicture
                        first={this.props.first}
                        last={this.props.last}
                        imgUrl={this.props.imgUrl}
                    />
                </div>
                {this.state.uploaderVisible && (
                    <Uploader
                        toggleModal={() => this.toggleModal()}
                        updateUrl={() => this.props.updateUrl()}
                    />
                )}
            </header>
        );
    }
}
