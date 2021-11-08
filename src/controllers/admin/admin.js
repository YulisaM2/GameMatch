var express = require('express');

const GameModel = require('../../models/game');
const TagModel = require('../../models/tag');

var router = express.Router();

router.get("/", async (_, res) => {
    res.render('admin/admin');
});

router.get("/games", async (_, res) => {
    const games = await GameModel.find().populate('tags');

    const tags = await TagModel.find();

    res.render('admin/games', { games, tags });
});

router.post('/games', async function (req, res) {
    const game = new GameModel(req.body);

    await game.save();

    res.redirect('/admin/games');
})

router.put('/games', async function (req, res) {
    let game = await GameModel.findOne({ _id: req.body._id });

    game.name = req.body.name;
    game.image = req.body.image;
    game.tags = req.body.tags;

    game = await game.save();
    
    res.redirect('/admin/games')
})

module.exports = router;
