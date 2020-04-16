import React from "react";
import ProfilePicture from "./ProfilePicture";
import Bio from "./Bio";
import DeleteAccountButton from "./DeleteAccountButton";

export default function Profile(props) {
    return (
        <section className="profile">
            <div className="container box">
                <h3>
                    {props.first} {props.last}
                </h3>
                <div className="profile-container">
                    <div className="position-relative">
                        <div
                            className="edit-symbol"
                            onClick={() => props.toggleModal()}
                        >
                            <i className="fas fa-edit"></i>
                        </div>
                        <ProfilePicture
                            first={props.first}
                            last={props.last}
                            imgUrl={props.imgUrl}
                            width="300px"
                        />
                        <DeleteAccountButton imgUrl={props.imgUrl} />
                    </div>
                    <Bio
                        first={props.first}
                        last={props.last}
                        bio={props.bio}
                        updateBio={(e) => props.updateBio(e)}
                    />
                </div>
            </div>
        </section>
    );
}
