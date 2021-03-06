import React, { useState } from "react";
import axios from "./axios";

export default function DeleteAccountButton(props) {
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [error, setError] = useState(false);

    const toggleModal = () => {
        setShowModalDelete(!showModalDelete);
    };

    const deleteAccount = () => {
        axios
            .post("/delete-account", { imageUrl: props.imgUrl })
            .then((response) => {
                if (!response.data.success) {
                    setError(true);
                } else {
                    location.replace("/welcome");
                }
            })
            .catch();
    };

    return (
        <>
            <button className="btn-neutral btn-delete" onClick={toggleModal}>
                Delete Account
            </button>
            {showModalDelete ? (
                <div className="modal">
                    <div className="modal-content">
                        <div className="close" onClick={toggleModal}>
                            <i className="fas fa-times"></i>
                        </div>
                        <h3>Are you sure you want to delete your account?</h3>
                        {error && (
                            <div className="error">
                                Oh, something went wrong. Please try again!
                            </div>
                        )}
                        <button
                            className="btn-secondary"
                            onClick={deleteAccount}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ) : null}
        </>
    );
}
