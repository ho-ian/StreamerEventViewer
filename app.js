var https = require('https');
var path = require('path');
var express = require('express');
var app = express();

const clientID = "dhkruxl3knfl8g90zjo9nfq3f4wk13";
const clientSecret = "9lqcrnzct6h9bxgxkj52iilt8v9opo";
const redirectURI = "http://localhost";

var options = "https://id.twitch.tv/oauth2/authorize?client_id="+clientID+"&redirect_uri="+redirectURI+"&response_type=code&scope=user:edit";
var resData = {link: options};

console.log(options);
  
  
app.get('/', function(req,res) {
    res.render(path.join(__dirname, 'index.html'), resData);
});

app.engine('html', require('ejs').renderFile);

app.listen(80);