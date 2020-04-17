import * as io from "socket.io-client";
import {
    chatMessages,
    chatMessage,
    privateChatMessages,
    privateChatMessage,
} from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => {
            store.dispatch(chatMessages(msgs));
        });

        socket.on("chatMessage", (msg) => {
            store.dispatch(chatMessage(msg));
        });

        socket.on("privateChatMessages", (msgs) => {
            store.dispatch(privateChatMessages(msgs));
        });

        socket.on("privateChatMessage", (msg) => {
            store.dispatch(privateChatMessage(msg));
        });
    }
};
