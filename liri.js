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
    type: "checkbox",
    message: "Choose an action",
    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
    name: "action"
    },
]).then(answers => {
    console.log(answers.action);
    if(answers.action === "my-tweets"){
        console.log("true");
    }
});
