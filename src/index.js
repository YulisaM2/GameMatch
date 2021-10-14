const express = require('express')
const home = require('./controllers/home')
const game = require('./controllers/game')
const api  = require('./controllers/api/api')
const mongoose = require('mongoose')
const seedDB = require("./seeds")

const app = express()
const port = 5000

app.use('/', home)
app.use('/api', api)
app.use('/games', game)
app.use(express.static('src/views/public'))

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


