function postHTML({title, description, tags, comments, author, createdAt}) {
    let tagsHTML = ""
    for (const tag of tags) {
        tagsHTML += `${tag.name} `
    }
    tagsHTML += ""

    let commentsHTML = ""
    for (const comment of comments) {
        console.log(comment)
        commentsHTML += `
            <div class="comment">
                <p><span class="author">username</span> * <span>${comment.createdAt}</span></p>
                <p>${comment.text}</p>
            </div>
        `
    }

    return `
        <div class="post">
            <p><span class="username">${author.username}</span> * <span class="creationDate">${createdAt}</span> * <span>${tagsHTML}</span></p>
            <h2>${title}</h2>
            <p>${description}</p>
            <div class="comments">
                ${commentsHTML}
            </div>
        </div>
    `
}

const wloc = window.location
// console.log(wloc)

const url = new URL(wloc)
// console.log(url)

const path = url.pathname
// console.log(path)

const gameID = path.split('/')[2]
// console.log(gameID)

const postID = path.split('/')[4]
// console.log(postID)

const postsController = new Posts()
postsController.get(gameID)
    .then(posts => {
        let postsHTML = ""

        posts.data.forEach(post => {
            postsHTML += postHTML(post)
        });

        const postsDiv = document.getElementById("posts")

        postsDiv.innerHTML = postsHTML
    })
