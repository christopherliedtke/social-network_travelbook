import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function (props) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        axios
            .get(`/friendship-status/${props.otherProfileId}`)
            .then((response) => {
                const { status } = response.data;
                if (status == null) {
                    setButtonText("Make Friend Request");
                } else if (status == "sender") {
                    setButtonText("Cancel Friend Request");
                } else if (status == "receiver") {
                    setButtonText("Accept Friend Request");
                } else if (status == "friend") {
                    setButtonText("End Friendship");
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const handleClick = () => {
        if (buttonText == "Make Friend Request") {
            axios
                .post(`/make-friend-request/${props.otherProfileId}`)
                .then((response) => {
                    if (response.data.success) {
                        setButtonText("Cancel Friend Request");
                    }
                })
                .catch((err) => console.log(err));
        } else if (
            buttonText == "Cancel Friend Request" ||
            buttonText == "End Friendship"
        ) {
            axios
                .post(`/end-friendship/${props.otherProfileId}`)
                .then((response) => {
                    if (response.data.success) {
                        setButtonText("Make Friend Request");
                    }
                })
                .catch((err) => console.log(err));
        } else if (buttonText == "Accept Friend Request") {
            //
            axios
                .post(`/accept-friend-request/${props.otherProfileId}`)
                .then((response) => {
                    if (response.data.success) {
                        setButtonText("End Friendship");
                    }
                })
                .catch((err) => console.log(err));
        }
        // else if (buttonText == "End Friendship") {
        //     //
        // }
    };

    return (
        <button className="btn-primary" onClick={handleClick}>
            {buttonText}
        </button>
    );
}
