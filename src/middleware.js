module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log("You must be signed in first")
        return res.redirect('/login')
    }
    next();
}