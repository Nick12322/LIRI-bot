require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdb = require('omdb');
var fs = require("fs");



var inquirer = require('inquirer');
//initial prompt asking what the user wants to do.
inquirer.prompt([
    {
        type: "list",
        message: "Choose an action",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "action"
    },
]).then(answers => {
    //logic for if user wants to see tweets
    if (answers.action === "my-tweets") {
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the handle of the user you'd like to see tweets from, e.g. 'realdonaldtrump', or 'nycguidovoice'.",
                name: "twitterHandle"
            },
        ]).then(handleInput => {
            var params = { screen_name: handleInput.twitterHandle };
            console.log(handleInput.twitterHandle)
            client.get('statuses/user_timeline', params, function (error, tweets, response) {
                if (!error) {
                    var tweetFrom = "\nTweets from: @" + tweets[0].user.screen_name;
                    console.log(tweetFrom);
                    for (var i = 0; i < 20; i++) {
                        console.log("\n Text of tweet: " + tweets[i].text + "\nOn: " + tweets[i].created_at);
                    }
                }
            })
        }
        )
        //logic for if user wants to spotify a song
    } else if (answers.action === "spotify-this-song") {
        inquirer.prompt([
            {
                type: "input",
                message: "Choose a song",
                name: "song",
            },
        ]).then(answers => {
            //spotify default to ace of base
            if (!answers.song) {
                spotify
                    .request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
                    .then(function (data) {
                        console.log("\nAlbum: " + data.album.name + "\nArtist: " + data.artists[0].name + "\nSong Name: " + data.name + "\nPreview Link: " + data.preview_url)
                    });

            } else {
                //spotify to user input, if given
                spotify.search({ type: 'track', query: answers.song }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    } else if (!err) {
                        //console.log(JSON.stringify(data.tracks.items[0].name, null, 2));
                        var info = data.tracks.items[0]
                        console.log("\nAlbum: " + info.album.name + "\nArtist: " + info.artists[0].name + "\nSong Name: " + info.name + "\nPreview Link: " + info.preview_url);
                    };
                })
            }
        })
        //logic for movie-this option
    } else if (answers.action === "movie-this") {
        inquirer.prompt([
            {
                type: "input",
                message: "Choose a movie to lookup",
                name: "movieInput",
            },
        ]).then(movieAnswer => {
            if (!movieAnswer.movieInput) {
                //default for mr.nobody
                request("http://www.omdbapi.com/?t=mr+nobody&apikey=trilogy", function (error, response, body) {
                    console.log("Movie Title: " + JSON.parse(body).Title);
                    console.log("Year of Release: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Country: " + JSON.parse(body).Country);
                    console.log("Language: " + JSON.parse(body).Language);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("Starring: " + JSON.parse(body).Actors);
                });
            } else {
                //gets user movie info if info given
                console.log(movieAnswer.movieInput);
                request("http://www.omdbapi.com/?t=" + movieAnswer.movieInput + "&apikey=trilogy", function (error, response, body) {
                    console.log("Movie Title: " + JSON.parse(body).Title);
                    console.log("Year of Release: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Country: " + JSON.parse(body).Country);
                    console.log("Language: " + JSON.parse(body).Language);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("Starring: " + JSON.parse(body).Actors);
                });
            }

        })

    } else if (answers.action === "do-what-it-says") {
        console.log("true");
        filename = "./random.txt"
        fs.readFile(filename, 'utf8', function(err, data) {
            console.log(data)
        })  
    }

});
