const express  = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const home     = require('./controllers/home')
const games    = require('./controllers/games')
const api      = require('./controllers/api/api')

const seedDB   = require("./seeds")

const app = express()
const port = 5000

app.set('views', process.cwd() + '/src/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use('/', home)
app.use('/api', api)
app.use('/games', games)
app.use(express.static('src/views/public'))

mongoose.connect("mongodb://localhost/gameMatch", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(async () => {
    console.log('DB Connected.');

    // Seeding db for local testing
    await seedDB();

    app.listen(port, () => {
      console.log(`GameMatch server listening at http://localhost:${port}`)
    });
  })
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
    process.exit(1);
  });
