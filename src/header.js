import React, { Component } from "react";
import ProfilePicture from "./profilepicture";
import Uploader from "./uploader";
import Logout from "./logout";

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
    updateUrl(url) {
        console.log("url: ", url);

        this.props.updateUrl(url);
    }
    render() {
        return (
            <header>
                <img src="img/logo_only.png" height="35px" alt="logo"></img>
                <div>
                    <div onClick={() => this.toggleModal()}>
                        <ProfilePicture
                            first={this.props.first}
                            last={this.props.last}
                            imgUrl={this.props.imgUrl}
                        />
                    </div>
                    <Logout />
                </div>
                {this.state.uploaderVisible && (
                    <Uploader
                        toggleModal={() => this.toggleModal()}
                        updateUrl={e => this.updateUrl(e)}
                    />
                )}
            </header>
        );
    }
}
