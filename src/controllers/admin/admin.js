var express = require('express');

const GameModel = require('../../models/game');
const TagModel = require('../../models/tag');

const { isAdmin } = require('../../middleware');

var router = express.Router();

router.get("/", isAdmin, async (_, res) => {
    res.render('admin/admin');
});

router.get("/games", isAdmin, async (_, res) => {
    const games = await GameModel.find().sort({ createdAt: 'desc' }).populate('tags');

    const tags = await TagModel.find();

    res.render('admin/games', { games, tags });
});

router.post('/games', isAdmin, async function (req, res) {
    const game = new GameModel(req.body);

    await game.save();

    res.redirect('/admin/games');
})

router.put('/games/:gameID', isAdmin, async function (req, res) {
    let game = await GameModel.findOne({ _id: req.params.gameID });

    if (req.body.name !== undefined) {
        game.name = req.body.name;
    }

    if (req.body.image !== undefined) {
        game.image = req.body.image;
    }

    if (req.body.tags !== undefined) {
        game.tags = req.body.tags;
    }

    if (req.body.deleted !== undefined) {
        game.deleted = req.body.deleted;
    }

    game = await game.save();
    
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
