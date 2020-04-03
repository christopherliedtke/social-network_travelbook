import React from "react";
import ProfilePicture from "./profilepicture";
import Bio from "./Bio";

export default function Profile(props) {
    return (
        <section className="profile">
            <div className="container">
                <div
                    className="position-relative"
                    onClick={() => props.toggleModal()}
                >
                    <div className="edit-symbol">
                        <i className="fas fa-edit"></i>
                    </div>
                    <ProfilePicture
                        first={props.first}
                        last={props.last}
                        imgUrl={props.imgUrl}
                        width="300px"
                    />
                </div>
                <Bio
                    first={props.first}
                    last={props.last}
                    bio={props.bio}
                    updateBio={e => props.updateBio(e)}
                />
            </div>
        </section>
    );
}
