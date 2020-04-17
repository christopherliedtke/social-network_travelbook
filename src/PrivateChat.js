import React, { useRef, useEffect } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";

export default function PrivateChat(props) {
    const elemRef = useRef();
    const privateChatMessages = useSelector(
        (state) => state && state.privateChatMessages
    );

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [privateChatMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("addNewPrivateMessage", {
                message: e.target.value,
                receiverId: props.otherUserId,
            });
            e.target.value = "";
        }
    };

    const adjustDate = (date) => {
        const newDate = new Date(date);
        return newDate.toUTCString();
    };
    return (
        <div className="private-chat">
            <div className="close" onClick={props.showPrivateChat}>
                <i className="fas fa-times"></i>
            </div>
            <div className="chat-messages-container" ref={elemRef}>
                {privateChatMessages &&
                    privateChatMessages.map((msg) => {
                        if (
                            msg["sender_id"] != props.otherUserId &&
                            msg["receiver_id"] != props.otherUserId
                        ) {
                            return null;
                        }
                        return (
                            <div
                                className={
                                    props.userId == msg["sender_id"]
                                        ? "chat-message-container own-message"
                                        : "chat-message-container"
                                }
                                key={msg["message_id"]}
                            >
                                <ProfilePicture
                                    first={msg["first_name"]}
                                    last={msg["last_name"]}
                                    imgUrl={msg["image_url"]}
                                    width="30px"
                                    height="30px"
                                />
                                <div>
                                    <span className="chat-message-name">
                                        {msg["first_name"]} {msg["last_name"]}
                                    </span>
                                    <span className="chat-message-date">
                                        {adjustDate(msg["created_at"])}
                                    </span>
                                    <div className="chat-message-box">
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <textarea
                name="message"
                rows="2"
                placeholder="Write message..."
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
