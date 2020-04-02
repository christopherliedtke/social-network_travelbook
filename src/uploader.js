import React, { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {}
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }
    submit() {
        if (this.state.file) {
            const formData = new FormData();
            formData.append("file", this.state.file);

            axios
                .post("/updateProfilePicture", formData)
                .then(response => {
                    console.log("response in submit new pic: ", response);

                    // give url to App
                    this.props.updateUrl(response.url);
                    // toggle modal
                    this.props.toggleModal();
                })
                .catch(err => {
                    console.log(
                        "Error on submit() in POST to /updateProfilePicture: ",
                        err
                    );
                    this.setState({
                        error: true
                    });
                });
        } else {
            this.setState({
                error: true
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="modal">
                    <div className="modal-content">
                        <div className="close" onClick={this.props.toggleModal}>
                            <i className="fas fa-times"></i>
                        </div>
                        <h3>Choose a new profile image</h3>
                        {this.state.error && (
                            <div className="error">
                                Oh, something went wrong. Please try again!
                            </div>
                        )}
                        <input
                            className="inputfile"
                            name="file"
                            type="file"
                            id="file"
                            accept="image/*"
                            onChange={e => this.handleChange(e)}
                        />
                        <label id="file-label" htmlFor="file">
                            Choose file
                        </label>
                        <button
                            className="btn-primary"
                            onClick={() => this.submit()}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
