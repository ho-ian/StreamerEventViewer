var express = require('express');
var passport = require('passport');
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
    scope: "channel_read user:read:email"
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
            });
        }
));

var initiateListener = function(oAuthToken, streamer) {
    //use get users https://dev.twitch.tv/docs/api/reference/#get-users to find streamer id
    console.log("Streamer Info");
    console.log("================================");
    axios({
        method: 'get',
        url: `https://api.twitch.tv/helix/users?login=${streamer}`,
        headers: {
            'Client-ID': `${TWITCHTV_CLIENT_ID}`
        }
    }).then((response) => {
        var streamerID = response.data.data[0].id;
        console.log(response.data.data[0]);

        // use streamer id to lookup channel info
        
        axios({
            method:'get',
            url: `https://api.twitch.tv/kraken/channels/${streamerID}`,
            headers: {
                'Accept': `application/vnd.twitchtv.v5+json`,
                'Client-ID': `${TWITCHTV_CLIENT_ID}`,
                'Authorization': `OAuth ${oAuthToken}`
            }
        }).then((response) => {
            console.log("Channel Info");
            console.log("================================");
            console.log(response.data);
        })

        // use streamer id to lookup stream info
        
        axios({
            method:'get',
            url: `https://api.twitch.tv/kraken/streams/${streamerID}`,
            headers: {
                'Accept': `application/vnd.twitchtv.v5+json`,
                'Client-ID': `${TWITCHTV_CLIENT_ID}`
            }
        }).then((response) => {
            console.log("Stream Info");
            console.log("================================");
            console.log(response.data);
        })

    });

}


var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('index.ejs', { code: req.query.code });
});

app.post('/', function(req,res) {
    initiateListener(req.query.code, req.body.name);
    res.redirect('/embedded');  //redirect to embedded page, where the streamers info will be pulled via twitch api
});

app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account.ejs', { user: req.user });
});


app.get('/auth/twitchtv',
    passport.authenticate('twitchtv'),
    function(req, res){
});

app.get('/auth/twitchtv/callback', function(req, res) {
    const requestToken = req.query.code;
    res.redirect(`/?code=${requestToken}`);
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