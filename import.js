// Author: D. Thompson
// Source: https://github.com/dthompson/example_geocouch_data/blob/master/flickr_data/import.js

var cradle = require("cradle")
, util = require("util")
, fs = require("fs");

// first create 'tatry' database (for example, in the Futon)

var connection = new(cradle.Connection)("localhost", 5984);
var db = connection.database('tatry');

data = fs.readFileSync("flickr_search.json", "utf-8");

flickr = JSON.parse(data);

for(p in flickr.photos.photo) {
  photo = flickr.photos.photo[p];

  photo.geometry = {"type": "Point", "coordinates": [photo.longitude, photo.latitude]};

  console.log("[lng, lat] = ", photo.longitude, photo.latitude)

  // save the url to the flickr image: s – small, m – medium, b – big
  // http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{secret}_[mstzb].jpg

  photo.image_url_small = "http://farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_m.jpg";

  db.save(photo.id, photo, function(er, ok) {
    if (er) {
      util.puts("Error: " + er);
      return;
    }
  });
}
