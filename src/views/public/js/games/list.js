function gameHTML({type, id, name, img}) {
    return `
        <div class="game">
            <img src="${img}" alt="${name} poster">
            <h2>${name}</h2>
        </div>
    `
}

const gamesController = new Games()
gamesController.get()
    .then(games => {
        console.log(games.data)

        let gamesHTML = ""

        games.data.forEach(game => {
            gamesHTML += gameHTML(game)
        });

        const gamesDiv = document.getElementById("games")

        gamesDiv.innerHTML = gamesHTML
    })
