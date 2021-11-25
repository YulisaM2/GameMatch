require('dotenv').config()

const express  = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize')
const flash = require("connect-flash")

const User = require('./models/user')

const home     = require('./controllers/home')
const games    = require('./controllers/games')
const api      = require('./controllers/api/api')
const auth     = require('./controllers/auth')
const admin    = require('./controllers/admin/admin')

const seedDB   = require("./seeds")
const { noCache } = require('./middleware');

const app = express()
const port = 5000

app.set('views', process.cwd() + '/src/views')
app.set('view engine', 'ejs')

app.use(flash());

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(mongoSanitize())

app.locals.moment = require('moment');
app.locals.moment.locale();

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  // console.log(req.query);
  res.locals.current_user = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  // res.locals.searched_title = req.query.search;
  next();
})

app.use(noCache);
app.use('/', home)
app.use('/api', api)
app.use('/games', games)
app.use('/', auth)
app.use('/admin', admin)
app.use(express.static('src/views/public'))
app.use(methodOverride('_method'))


mongoose.connect("mongodb://localhost/gameMatch", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(async () => {
    console.log('DB Connected.');

    // Seeding db for local testing
    //await seedDB();

    app.listen(port, () => {
      console.log(`GameMatch server listening at http://localhost:${port}`)
    });
  })
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
    process.exit(1);
  });


app.get("*", (req, res) =>{
  res.render('not-found');
  // res.render('server-error');
  // res.render('bad-request');
});