var express = require('express');

const GameModel = require('../../models/game');
const TagModel  = require('../../models/tag');
const UserModel = require('../../models/user');

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

    req.flash('success', 'Game added successfully.');
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
    
    req.flash('success', 'Game updated successfully.');
    res.redirect('/admin/games');
})

router.delete('/games/:gameID', isAdmin, async (req, res) => {
    const opResult = await GameModel.updateOne({ _id: req.params.gameID }, { deleted: true });

    if (opResult.modifiedCount < 1) {
        return res.status(404).redirect('/admin/games');
    }

    req.flash('success', 'Game deleted successfully.');
    res.redirect('/admin/games');
});

router.get("/users", isAdmin, async (_, res) => {
    const [users, usersError] = await handle(UserModel.find().sort({ createdAt: 'desc' }));

    if (usersError) {
        console.log(usersError);

        return res.status(500).render('server-error');
    }

    res.render('admin/users', { users });
});

router.post('/users', isAdmin, async function (req, res) {
    if (
        req.body.username  === undefined || req.body.username  === null ||
        req.body.email === undefined || req.body.email === null ||
        req.body.isAdmin  === undefined || req.body.isAdmin  === null
    ) {
        return res.status(400).render('bad-request');
    }

    const user = new UserModel(req.body);

    const [_, userSaveError] = await handle(user.save());

    if (userSaveError) {
        console.log(userSaveError);

        return res.status(500).render('server-error');
    }
    req.flash('success', 'User added successfully.');
    res.status(200).redirect('/admin/users');
})

router.put('/users/:userID', isAdmin, async function (req, res) {
    let [user, userError] = await handle(UserModel.findOne({ _id: req.params.userID }).exec());

    if (userError || user === undefined) {
        console.log(userError);

        return res.status(404).render('not-found');
    }

    user.username = req.body.username;
    user.email    = req.body.email;
    user.isAdmin  = req.body.isAdmin;
    user.deleted  = req.body.deleted;

    [user, userError] = await handle(user.save());

    if (userError) {
        console.log(userError);

        return res.status(400).render('bad-request');
    }
    req.flash('success', 'User updated successfully.');
    res.redirect('/admin/users');
})

router.delete('/users/:userID', isAdmin, async (req, res) => {
    const opResult = await UserModel.updateOne({ _id: req.params.userID }, { deleted: true });

    if (opResult.modifiedCount < 1) {
        return res.status(404).redirect('/admin/users');
    }
    req.flash('success', 'User deleted successfully.');
    res.redirect('/admin/users');
});

// ================ TAGS
router.get('/tags', isAdmin, async (req, res) => {
    const [tags, tagsError] = await handle(TagModel.find());

    if (tagsError) {
        console.log(tagsError);

        return res.status(500).render('server-error');
    }

    res.render('admin/tags', { tags });
});

router.post('/tags', isAdmin, async function (req, res) {
    if (
        req.body.name  === undefined || req.body.name  === null
    ) {
        return res.status(400).render('bad-request');
    }

    const tag = new TagModel(req.body);

    const [_, tagSaveError] = await handle(tag.save());

    if (tagSaveError) {
        console.log(tagSaveError);

        return res.status(500).render('server-error');
    }
    req.flash('success', 'Tag added successfully.');
    res.status(200).redirect('/admin/tags');
});

router.delete('/tags/:tagID', isAdmin, async (req, res) => {
    const opResult = await TagModel.deleteOne({ _id: req.params.tagID });

    req.flash('success', 'Tag deleted successfully.');
    res.redirect('/admin/tags');
});

router.put('/tags/:tagID', isAdmin, async function (req, res) {
    let [tag, tagError] = await handle(TagModel.findOne({ _id: req.params.tagID }).exec());

    if (tagError || tag === undefined) {
        console.log(tagError);

        return res.status(404).render('not-found');
    }

    tag.name  = req.body.name;

    [tag, tagError] = await handle(tag.save());

    if (tagError) {
        console.log(tagError);

        return res.status(400).render('bad-request');
    }
    req.flash('success', 'Tag updated successfully.');
    res.redirect('/admin/tags');
});


module.exports = router;
