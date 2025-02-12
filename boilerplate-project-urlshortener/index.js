require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const isURL = require("is-url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({extended: false}));
var original_url;
app.post('/api/shorturl', function(req,res){
  original_url=req.body.url;
  if(isURL(original_url))
    res.json({original_url: original_url, "short_url":1});
  else
    res.json({error: 'invalid url'});
})

app.get('/api/shorturl/:id', function(req,res){
  res.redirect(original_url);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
