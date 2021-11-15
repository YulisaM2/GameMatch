var express = require('express')

const { isLoggedIn } = require('../middleware');
const { handle } = require('./util/util');

const PostsController = require('./posts')
const GameModel = require('../models/game')
const PostModel = require('../models/post')

var router = express.Router()

router.get('/', async function (req, res) {
    const [games, gamesError] = await handle(GameModel.find({ deleted: false }));

    if (gamesError || games === []) {
        res.render('not-found');

        return;
    }
    
    res.render('games/list', {games, user: isLoggedIn });
});

router.get('/:id', async (req, res) => {
    const [game, gameError] = await handle(GameModel.findOne({ _id: req.params.id, deleted: false }).populate('tags').exec());

    if (gameError || game === null) {
        res.render('not-found');

        return;
    }

    const [posts, postsError] = await handle(PostModel.find({ game: req.params.id }).populate('author').sort({ createdAt: 'desc' }).exec());

    if (postsError || posts === null) {
        res.render('not-found');

        return;
    }

    res.render('games/single', { game, posts, user: req.user });
});

router.use('/:gameID/posts/', PostsController)

module.exports = router
