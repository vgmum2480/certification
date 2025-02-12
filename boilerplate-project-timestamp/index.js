// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api", function (req, res) {
  res.json({"unix": new Date().getTime(), "utc": new Date().toUTCString()});
});

app.get('/api/:date', (req, res)=>{
  /*if(date=="")
  {
    var date = new Date().getTime();
    var utcDate = new Date().toUTCString();
  }
  else
  {*/
    if(!Number.isNaN(Number(req.params.date)))
    {
      var date = new Date(Number(req.params.date)).getTime();
      var utcDate = new Date(Number(req.params.date)).toUTCString();
    }
    else
    {
      var date = new Date(req.params.date).getTime();
      var utcDate = new Date(req.params.date).toUTCString();
    }
  //}
  if (new Date(req.params.date) instanceof Date && !isNaN(date))
    res.json({"unix": date, "utc": utcDate});
  else
    res.json({ error : "Invalid Date" });
})

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
