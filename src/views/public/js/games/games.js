class Games {
    constructor() {}

    get(id) {
        if (id === undefined || id === null) {
            // get all games
            return axios.get('/api/games')
        }

        return axios.get(`/api/games/${id}`)
    }
}
