var express = require('express');
var passport = require('passport');
var util = require('util');
var axios = require('axios');
var path = require('path');
var TwitchtvStrategy = require('passport-twitchtv').Strategy;

var TWITCHTV_CLIENT_ID = "dhkruxl3knfl8g90zjo9nfq3f4wk13";
var TWITCHTV_CLIENT_SECRET = "9lqcrnzct6h9bxgxkj52iilt8v9opo";

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


passport.use(new TwitchtvStrategy({
    clientID: TWITCHTV_CLIENT_ID,
    clientSecret: TWITCHTV_CLIENT_SECRET,
    callbackURL: "http://localhost/auth/twitchtv/callback",
    scope: "user_read"
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
            });
        }
));

var initiateListener = function(accessToken, streamer) {
    // using access token, set user's fav streamer and follow all activity in background
}


var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    console.log(req.query.accessToken);
    res.render('index.ejs', { access: req.query.accessToken });
});

app.post('/', function(req,res) {
    console.log(req.body.name);
    initiateListener();
    res.redirect('/embedded');  //redirect to embedded page, where the streamers info will be pulled via twitch api
});

app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account.ejs', { user: req.user });
});


app.get('/auth/twitchtv',
    passport.authenticate('twitchtv'),
    function(req, res){
});

app.get('/auth/twitchtv/callback', 
    function(req, res) {
        const requestToken = req.query.code;
        axios({
            method: 'post',
            url: `https://id.twitch.tv/oauth2/token?client_id=${TWITCHTV_CLIENT_ID}&client_secret=${TWITCHTV_CLIENT_SECRET}&code=${requestToken}&grant_type=authorization_code&redirect_uri=http://localhost/auth/twitchtv/callback`
        }).then((response) => {
            const accessToken = response.data.access_token;
            res.redirect(`/?accessToken=${accessToken}`);
    })
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.listen(80);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}