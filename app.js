"use strict";

const express   = require('express');
var fs          = require('fs');
const app       = express();
const port      = 3000;

/** WEBSOCKET FOR CHAT */
process.title = 'koma-chat';
var webSocketsServerPort = 1337;
var webSocketServer = require('websocket').server;
var http = require('http');
var history = [ ];
var clients = [ ];
function htmlEntities(str) {
  return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
colors.sort(function(a,b) { return Math.random() > 0.5; } );
var server = http.createServer(function(request, response) {});
server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port "
      + webSocketsServerPort);
});
var wsServer = new webSocketServer({httpServer: server});
wsServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');
  var connection = request.accept(null, request.origin); 
  var index = clients.push(connection) - 1;
  var userName = false;
  var userColor = false;
  console.log((new Date()) + ' Connection accepted.');
  if (history.length > 0) {
    connection.sendUTF(
        JSON.stringify({ type: 'history', data: history} ));
  }
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
     if (userName === false) {
        userName = htmlEntities(message.utf8Data);
        userColor = colors.shift();
        connection.sendUTF(
            JSON.stringify({ type:'color', data: userColor }));
        console.log((new Date()) + ' User is known as: ' + userName+ ' with ' + userColor + ' color.');
      } else {
        console.log((new Date()) + ' Received Message from '+ userName + ': ' + message.utf8Data);
        var obj = {
          time: (new Date()).getTime(),
          text: htmlEntities(message.utf8Data),
          author: userName,
          color: userColor
        };
        history.push(obj);
        history = history.slice(-100);
        var json = JSON.stringify({ type:'message', data: obj });
        for (var i=0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
      }
    }
  });
  connection.on('close', function(connection) {
    if (userName !== false && userColor !== false) {
      console.log((new Date()) + " Peer "+ connection.remoteAddress + " disconnected.");
      clients.splice(index, 1);
      colors.push(userColor);
    }
  });
});

/** WEBSOCKET FOR CHAT */

/**  FILE HANDLING **/
const klawSync  =   require('klaw-sync')
var mysql       =   require('mysql');
const path      =   require('path');
/**  FILE HANDLING **/

/** FILE UPLOAD  */
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');


/* static shared dir */
let options = {

};
app.use(express.static("shared/drive",options));

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

app.use(cors());
app.use(morgan('dev'));
/** FILE UPLOAD  */

app.use(express.urlencoded());
app.use(express.json());

var Restricted_Komas = {
  "admin"     : "admin",
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
      break;
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

/** SOCKET TEST */
app.get('/Chat', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/Chat/Chat.html');
})
app.get('/Chat.js', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/Chat/Chat.js');
})
app.get('/Chat.css', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/Chat/Chat.css');
})
/** SOCKET TEST */

/** DRIVE  */
app.get('/MainPage', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/MainPage/index.html');
})
app.get('/index.css', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/MainPage/index.css');
})
app.get('/files.css', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/MainPage/files.css');
})
app.get('/Folder.js', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/MainPage/Folder.js');
})

/** OWNCAROUSEL */
app.get('/owl.carousel.min.css', (req, res) => {
  res.sendFile(__dirname + '/Libs/OwlCarousel2-2.3.4/dist/assets/owl.carousel.min.css');
})
app.get('/owl.theme.default.min.css', (req, res) => {
  res.sendFile(__dirname + '/Libs/OwlCarousel2-2.3.4/dist/assets/owl.theme.default.min.css');
})
app.get('/owl.carousel.min.js', (req, res) => {
  res.sendFile(__dirname + '/Libs/OwlCarousel2-2.3.4/dist/owl.carousel.min.js');
})
/** OWNCAROUSEL */
app.get('/GetFolders', (req, res) => {
  res.send(Fetch_Dirs());
})
/** DRIVE  */


/** FOLDER MÜVELETEK */
app.post('/CreateFolder', (req, res) => {
  var DirName = "shared/drive/";
  DirName += req.body.FolderName;
    if (!fs.existsSync(DirName)){
        fs.mkdirSync(DirName);
        res.send("Success");
    }else{
        res.send("Nope");
    }
})

app.post('/Multi_FileUploads', async (req, res) => {
  try {
      var FolderName = req.body.FolderName;
      var FolderPath = './shared/drive/'+FolderName+"/";
      if(FolderName == "drive"){
        FolderPath = './shared/drive/';
      }else{
        FolderPath = './shared/drive/'+FolderName+"/";
      }
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          let data = []; 
          for(var i = 0; i < req.files.files.length;i++){
            var File = req.files.files[i];
            //console.log(File);
            File.mv(FolderPath + File.name);
            data.push({
              name: File.name,
              mimetype: File.mimetype,
              size: File.size
            });
          }
          res.send({
              status: true,
              message: 'Files are uploaded',
              data: data
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
});

app.post('/Single_FileUploads', async (req, res) => {
  try {
      var FolderName = req.body.FolderName;
      var FolderPath = './shared/drive/'+FolderName+"/";
      if(FolderName == "drive"){
        FolderPath = './shared/drive/';
      }else{
        FolderPath = './shared/drive/'+FolderName+"/";
      }
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          let data = []; 
          for(var i = 0; i < req.files.files.length;i++){
            var File = req.files.files[i];
            File.mv(FolderPath + File.name);
            data.push({
              name: File.name,
              mimetype: File.mimetype,
              size: File.size
            });
          }
          res.send({
              status: true,
              message: 'Files are uploaded',
              data: data
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
});

/** FOLDER MÜVELETEK */

/** SHARED SCRIPTS  */
app.get('/OwnNotify.js', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/SharedScripts/OwnNotify.js');
})
app.get('/cookie.js', (req, res) => {
  res.sendFile(__dirname + '/FrontEnd/SharedScripts/cookie.js');
})
/** SHARED SCRIPTS  */


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})