var express = require('express');

const GameModel = require('../../models/game');
const TagModel = require('../../models/tag');

const { handle } = require('../util/util');
const { isAdmin } = require('../../middleware');

var router = express.Router();

router.get("/", isAdmin, async (_, res) => {
    res.render('admin/admin');
});

router.get("/games", isAdmin, async (_, res) => {
    const [games, gamesError] = await handle(GameModel.find().sort({ createdAt: 'desc' }).populate('tags'));

    if (gamesError) {
        console.log(gameError);

        return res.status(500).render('server-error');
    }

    const [tags, tagsError] = await handle(TagModel.find());

    if (tagsError) {
        console.log(tagsError);

        return res.status(500).render('server-error');
    }

    res.render('admin/games', { games, tags });
});

router.post('/games', isAdmin, async function (req, res) {
    if (
        req.body.name  === undefined || req.body.name  === null ||
        req.body.image === undefined || req.body.image === null ||
        req.body.tags  === undefined || req.body.tags  === null || req.body.tags === []
    ) {
        return res.status(400).render('bad-request');
    }

    const game = new GameModel(req.body);

    const [_, gameSaveError] = await handle(game.save());

    if (gameSaveError) {
        console.log(gameSaveError);

        return res.status(500).render('server-error');
    }

    res.status(200).redirect('/admin/games');
})

router.put('/games/:gameID', isAdmin, async function (req, res) {
    let [game, gameError] = await handle(GameModel.findOne({ _id: req.params.gameID }).exec());

    if (gameError || game === undefined) {
        console.log(gameError);

        return res.status(404).render('not-found');
    }

    game.name    = req.body.name;
    game.image   = req.body.image;
    game.tags    = req.body.tags;
    game.deleted = req.body.deleted;

    [game, gameError] = await handle(game.save());

    if (gameError) {
        console.log(gameError);

        return res.status(400).render('bad-request');
    }
    
    res.redirect('/admin/games');
})

router.delete('/games/:gameID', isAdmin, async (req, res) => {
    const opResult = await GameModel.updateOne({ _id: req.params.gameID }, { deleted: true });

    if (opResult.modifiedCount < 1) {
        return res.status(404).redirect('/admin/games');
    }

    res.redirect('/admin/games');
});

module.exports = router;
