const express = require('express')
const home = require('./controllers/home')
const game = require('./controllers/game')

const app = express()
const port = 3000

app.use('/', home)
app.use('/games', game)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
