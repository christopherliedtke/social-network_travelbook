import React, { useRef, useEffect } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";

export default function Chat(props) {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.chatMessages);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("addNewMessage", e.target.value);
            e.target.value = "";
        }
    };

    const adjustDate = (date) => {
        const newDate = new Date(date);
        return newDate.toUTCString();
    };

    return (
        <section className="chat">
            <div className="container box">
                <h1 className="text-center">Chat</h1>
                <div className="chat-messages-container" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((msg) => {
                            return (
                                <div
                                    className={
                                        props.userId == msg["user_id"]
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
                                            {msg["first_name"]}{" "}
                                            {msg["last_name"]}
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
                    rows="3"
                    placeholder="Write message..."
                    onKeyDown={keyCheck}
                ></textarea>
            </div>
        </section>
    );
}
