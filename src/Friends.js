import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllFriendsRequests,
    acceptFriendRequest,
    endFriendship,
} from "./actions";

import ProfilePicture from "./ProfilePicture";

export default function Friends(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllFriendsRequests());
    }, []);

    const friends = useSelector((state) => {
        return (
            state.friends &&
            state.friends.filter((friend) => friend.accepted === true)
        );
    });

    const requests = useSelector((state) => {
        return (
            state.friends &&
            state.friends.filter((friend) => friend.accepted === false)
        );
    });

    return (
        <section className="friends">
            <div className="container">
                <h2>Friends</h2>
                <div className="friends-wrapper">
                    {friends &&
                        friends.map((friend) => {
                            return (
                                <div
                                    className="friend-container"
                                    key={friend.id}
                                >
                                    <p>
                                        {friend["first_name"]}{" "}
                                        {friend["last_name"]}
                                    </p>
                                    <Link to={`/user/${friend.id}`}>
                                        <ProfilePicture
                                            first={friend["first_name"]}
                                            last={friend["last_name"]}
                                            imgUrl={friend["image_url"]}
                                            width="180px"
                                            height="180px"
                                        />
                                    </Link>
                                    <button
                                        className="btn-secondary"
                                        onClick={() =>
                                            dispatch(endFriendship(friend.id))
                                        }
                                    >
                                        End Friendship
                                    </button>
                                </div>
                            );
                        })}
                </div>
                <h2>Friend Requests</h2>
                <div className="friends-wrapper">
                    {friends &&
                        requests.map((request) => {
                            return (
                                <div
                                    className="friend-container"
                                    key={request.id}
                                >
                                    <p>
                                        {request["first_name"]}{" "}
                                        {request["last_name"]}
                                    </p>
                                    <Link to={`/user/${request.id}`}>
                                        <ProfilePicture
                                            first={request["first_name"]}
                                            last={request["last_name"]}
                                            imgUrl={request["image_url"]}
                                            width="180px"
                                            height="180px"
                                        />
                                    </Link>
                                    <button
                                        className="btn-primary"
                                        onClick={() => {
                                            dispatch(
                                                acceptFriendRequest(request.id)
                                            );
                                            props.updateOpenFriendRequests();
                                        }}
                                    >
                                        Accept Friend Request
                                    </button>
                                    <button
                                        style={{ marginTop: 0 }}
                                        className="btn-secondary"
                                        onClick={() => {
                                            dispatch(endFriendship(request.id));
                                            props.updateOpenFriendRequests();
                                        }}
                                    >
                                        Reject Friend Request
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
        </section>
    );
}
