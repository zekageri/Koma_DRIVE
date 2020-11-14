const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/Login/Login.html');
})

app.get('/Login', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/Drive/Drive.html');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})