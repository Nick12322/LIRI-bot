require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var inquirer = require('inquirer');
inquirer.prompt([
    {
        type: "list",
        message: "Choose an action",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "action"
    },
]).then(answers => {
    if (answers.action === "my-tweets") {
        var params = { screen_name: 'Nickwoodwardcbc' };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                var tweetFrom = "\nTweets from: @" + tweets[0].user.screen_name;
                console.log(tweetFrom);
                for (var i = 0; i < 20; i++) {
                    console.log("\n Text of tweet: " + tweets[i].text + "\nOn: " + tweets[i].created_at);
                }
            }
        });
    } else if (answers.action === "spotify-this-song") {
        inquirer.prompt([
            {
                type: "input",
                message: "Choose a song",
                name: "song",
            },
        ]).then(answers => {
            console.log(answers.song);
            
            spotify.search({ type: 'track', query: answers.song }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                } else if (!err) {
                    //console.log(JSON.stringify(data.tracks.items[0].name, null, 2));
                    var info = data.tracks.items[0]
                    console.log("\nAlbum: " + info.album.name + "\nArtist: " + info.artists[0].name + "\nSong Name: " + info.name + "\nPreview Link: " + info.preview_url);
                };
            })
        })
    };
});
