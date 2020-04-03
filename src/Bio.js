import React, { Component } from "react";
import axios from "./axios";

export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showBioEdit: false
        };
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }
    editBio() {
        this.setState({
            showBioEdit: true,
            bio: this.props.bio
        });
    }
    submitBio() {
        axios
            .post("/updateBio", { bio: this.state.bio })
            .then(response => {
                if (response.data.success) {
                    this.props.updateBio(this.state.bio);
                    this.setState({ showBioEdit: false });
                } else {
                    this.setState({ error: true });
                }
            })
            .catch(err => {
                console.log(
                    "Error on submitBio() in POST to /updateBio: ",
                    err
                );
                this.setState({
                    error: true
                });
            });
    }
    getCurrentDisplay() {
        if (this.state.showBioEdit) {
            return (
                <React.Fragment>
                    <textarea
                        rows="15"
                        cols="40"
                        name="bio"
                        value={this.state.bio}
                        onChange={e => this.handleChange(e)}
                    ></textarea>
                    <button
                        className="btn-primary"
                        onClick={() => this.submitBio()}
                    >
                        Update
                    </button>
                    {this.state.error && (
                        <div className="error">
                            Oh, something went wrong. Please try again!
                        </div>
                    )}
                </React.Fragment>
            );
        } else if (!this.props.bio) {
            return (
                <button className="btn-primary" onClick={() => this.editBio()}>
                    Add bio
                </button>
            );
        } else {
            return (
                <React.Fragment>
                    <div className="bio-txt-box">{this.props.bio}</div>
                    <button
                        className="btn-primary"
                        onClick={() => this.editBio()}
                    >
                        Edit bio
                    </button>
                </React.Fragment>
            );
        }
    }
    render() {
        const fullName = this.props.first + " " + this.props.last;
        return (
            <div className="bio">
                <h3>{fullName}</h3>
                {this.getCurrentDisplay()}
            </div>
        );
    }
}
