var express = require('express');
var cors = require('cors');
require('dotenv').config();
const fs = require('node:fs/promises');
const bodyParser = require('body-parser');
var multer = require("multer");

var app = express();
var upload = multer({ dest: "uploads/" });

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), async (req,res) =>{
  try{
    res.json({name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });
  }
  catch(err){
    console.log(err);
  }
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
