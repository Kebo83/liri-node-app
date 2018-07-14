const dotenv = require("dotenv").config();
const fs = require('fs');
const keys = require('./keys.js');
const request = require('request');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
const nodeArgv = process.argv;
const command = process.argv[2];
var input = "";

for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    input = input + "+" + nodeArgv[i];
  } else{input = input + nodeArgv[i];
  }
}
switch(command){
  case "my-tweets":
    seeTweets();
  break;
  case "spotify-this-song":
    if(input){
      searchSong(input);
    } else{
      searchSong("Sweet Home Alabama");
    }
  break;
  case "movie-this":
    if(input){
      searchMovie(input)
    } else{
      searchMovie("Mr. Nobody")
    }
  break;
  case "do-what-it-says":
    doIt();
  break;
  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function seeTweets(){
  const screenName = {screen_name: 'JohnnyJ96869219'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        const date = tweets[i].created_at;
        console.log("@JohnnyJ96869219: " + tweets[i].text + " Created At: " + date.substring(0, 19));
      }
    }else{console.log('Error occurred');
    }
  });
}

function searchSong(input){
spotify.search({ type: 'track', query: input}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        const songData = data.tracks.items[i];
        console.log("Artist: " + songData.artists[0].name);
        console.log("Song: " + songData.name);
        console.log("Preview URL: " + songData.preview_url);
        console.log("Album: " + songData.album.name);
      }
    } else{console.log('Error occurred.');
    }
  });
}

function searchMovie(input){
  const URL = 'http://www.omdbapi.com/?t='+input+'&apikey=dcf3026c';
  request(URL, function (error, response, data){
    if(!error && response.statusCode == 200){
      var data = JSON.parse(data);
      // console.log(data)
      console.log("Title: " + data.Title);
      console.log("Release Year: " + data.Year);
      console.log("IMdB Rating: " + data.imdbRating);
      console.log("Rotten Tomatoes Rating: " + data.tomatoRating);
      console.log("Country: " + data.Country);
      console.log("Language: " + data.Language);
      console.log("Plot: " + data.Plot);
      console.log("Actors: " + data.Actors);
}
 else{console.log('Error occurred.')}
    if(input === "Mr. Nobody"){
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");
    }
  });
}

function doIt(){fs.readFile("./random.txt","utf8", function(error,data){
    if (error) {
			console.log(error);
		} else {
    // console.log(data);
   var txt = data.split(',');
    // console.log(txt);
    searchSong(txt[1]);
    }
});
}
