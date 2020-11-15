const express = require('express');
var fs        = require('fs');
const app     = express();
const port    = 3000;
const klawSync  =   require('klaw-sync')
var mysql       =   require('mysql');
const path      =   require('path');

app.use(express.urlencoded());
app.use(express.json());

var Restricted_Komas = {
  "Dr.Random" : "Mrrandom0829",
};

function Fetch_Dirs(){
  var items = [];
  var paths = klawSync('./shared/drive');
  for(var i = 0; i < paths.length; i++){
      items.push(paths[i].path);
  }
  return items;
}

function Search_Koma(user,pw){
  var IsFound = false;
  for (const [key, value] of Object.entries(Restricted_Komas)) {
    if(key == user && value == pw){
      IsFound = true;
    }
  }
  return IsFound;
}

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/FrontEnd/Login/Login.html');
  })

/** LOGIN  */
  app.post('/KomaLogin', (req, res) => {
    if( Search_Koma(req.body.username,req.body.pw) ){
      res.send("Success");
    }else{
      res.send("Nope");
    }
  })
  app.get('/Login.css', (req, res) => {
    res.sendFile(__dirname + '/FrontEnd/Login/Login.css');
  })
/** LOGIN  */

/** IMAGES  */
app.get('/AppIcon.png', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/images/AppIcon.png');
})
/** IMAGES  */

/** DRIVE  */
app.get('/MainPage', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/MainPage/index.html');
})
app.get('/index.css', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/MainPage/index.css');
})

app.get('/GetFolders', (req, res) => {
  res.send(Fetch_Dirs());
})

/** DRIVE  */

/** SHARED SCRIPTS  */
app.get('/OwnNotify.js', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/SharedScripts/OwnNotify.js');
})
app.get('/Cookie.js', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/SharedScripts/Cookie.js');
})
/** SHARED SCRIPTS  */


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})