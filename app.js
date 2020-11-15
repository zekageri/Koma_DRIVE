const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/Login/Login.html');
})

app.get('/Login', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/Drive/Drive.html');
})

app.post('/KomaLogin', (req, res) => {
  if(req.body != 0){
    console.log(req.body);
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})