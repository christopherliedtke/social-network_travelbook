import React from "react";
import ProfilePicture from "./ProfilePicture";
import Bio from "./Bio";

export default function Profile(props) {
    return (
        <section className="profile">
            <div className="container box">
                <h3>
                    {props.first} {props.last}
                </h3>
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
                    updateBio={(e) => props.updateBio(e)}
                />
            </div>
        </section>
    );
}
