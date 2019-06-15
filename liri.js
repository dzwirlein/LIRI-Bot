
require("dotenv").config();

var keys = require("./keys.js");

var fs = require("fs");

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys);

var axios = require("axios");

var moment = require("moment")



var getMovie = function(movieName){

var queryUrlOMDB = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

axios.get(queryUrlOMDB).then(
  function(response) {

    var movie = [
    "Title: " + response.data.Title,
    "Release Year: " + response.data.Year,
    "IMDB Rating: " + response.data.imdbRating,
    "Rotten Tomatoes: " + response.data.Ratings[1].Value,
    "Country Produced: " + response.data.Country,
    "Language: " + response.data.Language,
    "Plot: " + response.data.Plot,
    "Actors: " + response.data.Actors,
    "\n--------------------------------\n"
    ].join('\n\n');

    fs.appendFile("log.txt", movie, function(err) {
      if (err) throw err;
      console.log(movie);
       })
   
})

};



var findShow = function(artist){

var queryUrlB = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
axios.get(queryUrlB).then(
    function(response) {
      for ( var i=0; i < response.data.length; i++){
        var date = moment(response.data[i].datetime).format("MM-DD-YYYY");
        var event = [
            "Venue: " + response.data[i].venue.name,
            "\nVenue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country,
            "\nDate: " + date,
            "\n--------------------------------\n"
        ].join("\n\n");
      
        fs.appendFile("log.txt", event, function(err) {
          if (err) throw err;
          console.log(event);
           })
      }
       
    }
);

}


var getArtist = function(artist){
  return artist.name
}

var getSpotify = function(songName) {
 
spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
    }
   
  var songs = data.tracks.items;
  for( var i=0; i<songs.length; i++){
      var artistObj = [
        "Artist(s): " + songs[i].artists.map(getArtist),
        "\nSong Name: " + songs[i].name,
        "\nPreview Song: " + songs[i].preview_url,
        "\nAlbum: " + songs[i].album.name,
        "\n--------------------------------\n"
      ].join("\n\n");
    
  fs.appendFile("log.txt", artistObj, function(err) {
   if (err) throw err;
   console.log(artistObj);
    })
  }

  });

}

var control = function(){

fs.readFile('random.txt', 'utf-8', function(err, data){
  if (err) throw err;
 
    var dataArr = data.split(",");

    console.log(dataArr)

    if (dataArr.length === 2){
      choose(dataArr[0], dataArr[1]) 
    } else if (dataArr.length === 1){
      choose(dataArr[0])
    }

});
}


var choose = function(caseData, functionData) {
    switch(caseData) {
      case "spotify-this-song":
        getSpotify(functionData);
        break;
      case "concert-this":
        findShow(functionData);
        break;
      case "movie-this":
        getMovie(functionData);
        break;
      case "do-what-it-says":
        control();
      break;
      default:
          console.log("LIRI does not know that command");
    }
}

var run = function(x, y) {
  choose(x, y);
};

run(process.argv[2], process.argv[3])