require('dotenv').config();
const express  = require('express')
const mongoose = require('mongoose')

const home     = require('./controllers/home')
const games    = require('./controllers/games')
const api      = require('./controllers/api/api')
const account = require('./controllers/api/account')

const seedDB   = require("./seeds")

const app = express()
const port = 5000

app.use('/', home)
app.use('/api', api)
app.use('/games', games)
app.use('/account', account)
app.use(express.static('src/views/public'))

app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect("mongodb://localhost/gameMatch", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => 
            console.log('DB Connected.')
    )
    .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
});

// Seeding db for local testing
seedDB();


