var express = require('express')

const { isLoggedIn } = require('../middleware');
const { handle, escapeRegex} = require('./util/util');

const PostsController = require('./posts')
const GameModel = require('../models/game')
const PostModel = require('../models/post')

var router = express.Router()

router.get("/", async function (req, res){
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const [games, gamesError] = await handle(GameModel.find({ name: regex, deleted: false }));

        if (gamesError) {
             res.status(404).render('not-found');
            return;
        }
        if(games.length < 1){
            console.log("No game title matched, please try again!");
            res.redirect('back');
        }else{
            res.render('games/list', {games, user: isLoggedIn });
        }


	}else{
        const [games, gamesError] = await handle(GameModel.find({deleted: false }));
        if (gamesError || games === []) {
            res.status(404).render('not-found');

            return;
        }

        res.render('games/list', {games, user: isLoggedIn });

	}
});

router.get('/:id', async (req, res) => {
    const [game, gameError] = await handle(GameModel.findOne({ _id: req.params.id, deleted: false }).populate('tags').exec());

    if (gameError || game === null) {
        res.status(404).render('not-found');

        return;
    }

    const [posts, postsError] = await handle(PostModel.find({ game: req.params.id }).populate('author').sort({ createdAt: 'desc' }).exec());

    if (postsError || posts === null) {
        res.status(404).render('not-found');

        return;
    }

    res.render('games/single', { game, posts, user: req.user });
});

router.get('/:id/create', isLoggedIn, async (req, res) =>{
    // res.render('./posts/CreatePost');

    const [game, gameError] = await handle(GameModel.findOne({ _id: req.params.id, deleted: false }).populate('tags').exec());

    if (gameError || game === null) {
        res.render('not-found');

        return;
    }

    res.render('posts/CreatePost', {user: req.user, game});
});

router.use('/:gameID/posts/', PostsController)

module.exports = router
