import React, { Component } from "react";
import axios from "./axios";
import ProfilePicture from "./ProfilePicture";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        axios
            .get(`/user/${id}.json`)
            .then((response) => {
                if (response.data.redirect) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        first: response.data.data["first_name"],
                        last: response.data.data["last_name"],
                        imgUrl: response.data.data["image_url"],
                        bio: response.data.data.bio,
                    });
                }
            })
            .catch();
    }

    render() {
        const fullName = this.state.first + " " + this.state.last;
        return (
            <section className="profile">
                <div className="container">
                    <div>
                        <ProfilePicture
                            first={this.state.first}
                            last={this.state.last}
                            imgUrl={this.state.imgUrl}
                            width="300px"
                        />
                    </div>
                    <div className="bio">
                        <h3>{fullName}</h3>
                        <div className="bio-txt-box">{this.state.bio}</div>
                    </div>
                </div>
            </section>
        );
    }
}
