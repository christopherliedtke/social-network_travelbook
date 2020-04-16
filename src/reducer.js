export default function reducer(state = {}, action) {
    //
    if (action.type == "GET_ALL_FRIENDS_REQUESTS") {
        return { ...state, friends: action.friends };
    }
    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friends: state.friends.map((friend) => {
                if (action.id === friend.id) {
                    return { ...friend, accepted: true };
                } else {
                    return friend;
                }
            }),
        };
    }
    if (action.type == "END_FRIENDSHIP") {
        state = {
            ...state,
            friends: state.friends.filter((friend) => {
                if (action.id != friend.id) {
                    return friend;
                }
            }),
        };
    }
    if (action.type == "LOAD_ALL_CHAT_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages,
        };
    }
    if (action.type == "LOAD_NEW_CHAT_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.chatMessage],
        };
    }
    return state;
}
