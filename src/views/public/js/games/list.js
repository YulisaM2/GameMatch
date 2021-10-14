function gameHTML({image, name, _id}) {
    return `
        <div class="game">
            <img src="${image}" alt="${name} poster">
            <h2><a href="/games/${_id}/posts">${name}</a></h2>
        </div>
    `
}

const gamesController = new Games()
gamesController.get()
    .then(games => {
        let gamesHTML = ""

        games.data.forEach(game => {
            gamesHTML += gameHTML(game)
        });

        const gamesDiv = document.getElementById("games")

        gamesDiv.innerHTML = gamesHTML
    })
