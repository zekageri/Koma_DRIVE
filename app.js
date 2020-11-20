const express = require('express');
var fs        = require('fs');
const app     = express();
const port    = 3000;

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
  "Dr.Random" : "Mrrandom0829",
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
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          let data = []; 
          for(var i = 0; i < req.files.files.length;i++){
            var File = req.files.files[i];
            console.log(File);
            File.mv('./shared/drive/'+FolderName+"/" + File.name);
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