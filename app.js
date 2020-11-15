const express = require('express')
const app     = express()
const port    = 3000

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/FrontEnd/Login/Login.html');
  })

/** LOGIN  */
  app.post('/KomaLogin', (req, res) => {
    console.log(req.body);
    res.sendFile(__dirname + '/FrontEnd/Drive/Drive.html');
  })
  app.get('/Login.css', (req, res) => {
    res.sendFile(__dirname + './FrontEnd/Login/Login.css');
  })
/** LOGIN  */


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})