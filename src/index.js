const express = require('express')
const home = require('./controllers/home')
const games = require('./controllers/games')
const api  = require('./controllers/api/api')

const app = express()
const port = 3000

app.use('/', home)
app.use('/api', api)
app.use('/games', games)
app.use(express.static('src/views/public'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
