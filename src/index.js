const express = require('express')
const home = require('./controllers/home')
const game = require('./controllers/game')
const api  = require('./controllers/api/api')

const app = express()
const port = 3000

app.use('/', home)
app.use('/api', api)
app.use('/games', game)
app.use(express.static('src/views/public'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
