class Posts {
    constructor() {}

    get(gameID, postID) {
        if (gameID === undefined || gameID === null) {
            return null
        }

        if (postID === undefined || postID === null) {
            // get all posts
            return axios.get(`/api/games/${gameID}/posts`)
        }

        return axios.get(`/api/games/${gameID}/posts/${postID}`)
    }
}
