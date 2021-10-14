function gameHTML({image, name}) {
    return `
        <div class="game">
            <img src="${image}" alt="${name} poster">
            <h2>${name}</h2>
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
