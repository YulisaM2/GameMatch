const mongoose = require('mongoose')

const Comment = require('./models/comment')
const Game = require('./models/game')
const Post = require('./models/post')
const Tag = require('./models/tag')
const User = require('./models/user')

const dummy_games = [
    {
        seedID: 0,
        name: "League of Legends",
        image: "https://static-cdn.jtvnw.net/ttv-boxart/League%20of%20Legends-285x380.jpg",
        tags: [0, 3, 4],
    }, 
    {
        seedID: 1,
        name: "Call of Duty: Warzone",
        image: "https://static-cdn.jtvnw.net/ttv-boxart/Call%20of%20Duty:%20Warzone-285x380.jpg",
        tags: [1],
    },
    {
        seedID: 2,
        name: "Valorant",
        image: "https://static-cdn.jtvnw.net/ttv-boxart/VALORANT-285x380.jpg",
        tags: [2, 3, 4],
    },
    {
        seedID: 3,
        name: "Battlefield: 2042",
        image: "https://static-cdn.jtvnw.net/ttv-boxart/Battlefield%202042-285x380.jpg",
        tags: [4],
    },
];

const dummy_posts = [
    {
        seedID: 0,
        title: "New team mate",
        description: "We need a new member to be part of our gang for the summer",
        game: 0,
        tags: [0],
        comments: [0],
    },
    {
        seedID: 1,
        title: "Competing for Gold",
        description: "We want to train as much as possible to level up and get better perks like new weapons",
        game: 0,
        tags: [3, 4],
        comments: [],
    },
    {
        seedID: 2,
        title: "Some Warzone post",
        description: "Some Warzone description",
        game: 1,
        tags: [],
        comments: [],
    }
];

const dummy_tags = [
    {
        seedID: 0,
        name: "1v1"
    },
    {
        seedID: 1,
        name: "Battle Royale"
    },
    {
        seedID: 2,
        name: "Capture The Flag"
    },
    {
        seedID: 3,
        name: "Ranking"
    },
    {
        seedID: 4,
        name: "Team Battle"
    },
];

const dummy_users = [
    {
        seedID: 0,
        username: "n00b",
        password: "1234",
        isAdmin: true,
        name: "Guillermo Meraz",
        email: "fake@fake.com"
    },
    {
        seedID: 1,
        username: "fakefan",
        password: "lol",
        name: "Osorio de la Cruz",
        email: "osoriodelacruz@fake.com"
    },
];

const dummy_comments = [
    {
        seedID: 0,
        text: "I'd like to join.",
        author: {
            id: 1,
            username: "fakefan",
            name: "Guillermo Meraz",
        },
        createdAt: Date.now(),
    },
]

const emptyDB = async () => {
    try {
        await Game.deleteMany();
        console.log("------ Games removed ------");

        await Comment.deleteMany();
        console.log("------ Comments removed ------");

        await Tag.deleteMany();
        console.log("------ Tags removed ------");

        await Post.deleteMany();
        console.log("------ Posts removed ------");

        await User.deleteMany();
        console.log("------ Users removed ------");
    } catch (err) {
        console.log(err);
    }
};

const seedUsers = async () => {
    return User.create(dummy_users);
}

const seedTags = async () => {
    const tags = await Tag.create(dummy_tags);

    const tagMap = {};

    for (const dummy_tag of dummy_tags) {
        tagMap[dummy_tag.seedID] = tags[dummy_tag.seedID];
    }

    return tagMap;
}

const seedGames = async tags => {
    for (let i = 0; i < dummy_games.length; i++) {
        const tagsSeedIDs = dummy_games[i].tags;
        dummy_games[i].tags = [];

        for (const tagSeedID of tagsSeedIDs) {
            dummy_games[i].tags.push(tags[tagSeedID]._id);
        }
    }

    const games = await Game.create(dummy_games);

    const gameMap = {};

    for (const dummy_game of dummy_games) {
        gameMap[dummy_game.seedID] = games[dummy_game.seedID];
    }

    return gameMap;
}

const seedPosts = async (games, tags, comments) => {
    for (let i = 0; i < dummy_posts.length; i++) {
        // change game id
        dummy_posts[i].game = games[dummy_posts[i].game]._id;

        // change tag ids
        const tagsSeedIDs = dummy_posts[i].tags;
        dummy_posts[i].tags = [];

        for (const tagSeedID of tagsSeedIDs) {
            dummy_posts[i].tags.push(tags[tagSeedID]._id);
        }

        // change comment ids
        const commentsSeedIDs = dummy_posts[i].comments;
        dummy_posts[i].comments = [];

        for (const commentSeedID of commentsSeedIDs) {
            dummy_posts[i].comments.push(comments[commentSeedID]._id);
        }
    }

    const posts = await Post.create(dummy_posts);

    const postMap = {};

    for (const dummy_post of dummy_posts) {
        postMap[dummy_post.seedID] = posts[dummy_post.seedID];
    }

    return postMap;
}

const seedComments = async users => {
    for (let i = 0; i < dummy_comments.length; i++) {
        // change user id
        dummy_comments[i].author.id = users[dummy_comments[i].author.id]._id;
    }

    const comments = await Comment.create(dummy_comments);

    const commentMap = {};

    for (const dummy_comment of dummy_comments) {
        commentMap[dummy_comment.seedID] = comments[dummy_comment.seedID];
    }

    return commentMap;
}

const seedDB = async () => {
    await emptyDB();

    try {
        const users = await seedUsers();
        console.log('Added users.');

        const tags = await seedTags();
        console.log('Added tags.');

        const games = await seedGames(tags);
        console.log('Added games.');

        const comments = await seedComments(users);
        console.log('Added comments.');

        const posts = await seedPosts(games, tags, comments);
        console.log('Added posts.');
    } catch (err) {
        console.log(err);
    }
};

module.exports = seedDB;
