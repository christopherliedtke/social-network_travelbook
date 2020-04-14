import axios from "./axios";

export function getAllFriendsRequests() {
    return axios
        .get("/friends-and-requests")
        .then(({ data }) => {
            return {
                type: "GET_ALL_FRIENDS_REQUESTS",
                friends: data,
            };
        })
        .catch((err) =>
            console.log(
                "Error on GET in getAllFriendsRequests to /friends-and-requests: ",
                err
            )
        );
}
export function acceptFriendRequest(id) {
    return axios.post(`/accept-friend-request/${id}`).then(({ data }) => {
        if (data.success) {
            return {
                type: "ACCEPT_FRIEND_REQUEST",
                id,
            };
        }
    });
}
export function endFriendship(id) {
    return axios.post(`/end-friendship/${id}`).then(({ data }) => {
        if (data.success) {
            return {
                type: "END_FRIENDSHIP",
                id,
            };
        }
    });
}
