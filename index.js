var express = require('express');
var https = require('https');
var fs = require('fs');
var credentials = JSON.parse(fs.readFileSync('credentials.json', 'UTF-8'));
var secret = credentials.facebook.secret;
var client = credentials.facebook.client;
var app = express();

app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/oauth', function(req,res){
  var token_URL =   {
    host: 'graph.facebook.com',
    path: '/v2.8/oauth/access_token?'+
      'client_id=' + client +
      '&client_secret=' + secret +
      '&redirect_uri=http://localhost:1337/oauth' +
      '&code=' + req.query.code
  };
  function after_recieved_token(response){
    
    response.setEncoding('utf8');
    response.on('data', function(d){
      d = JSON.parse(d);
      res.redirect('/?access_token='+d.access_token);
    });
  }  
  https.get(token_URL, after_recieved_token);
});

app.listen(1337, function () {
  console.log('Example app listening on port 1337!');
});