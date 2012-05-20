var cradle = require("cradle")
, util = require("util")
, fs = require("fs");

var connection = new(cradle.Connection)("localhost", 5984);
var db = connection.database('ufo');

var couchimport = function(filename) {
  var data = fs.readFileSync(filename, "utf-8");
  var dane = JSON.parse(data);
  var counter = 0;
      db.save("_design/data", dane, function(er, ok) {
	
        if (er) {
          util.puts("Error: " + er);
          return;
        }
      });
  return counter;
};

var filenames =  ["mapReduce.json"];
filenames.forEach(function (name) {
  var n = couchimport(name);
  console.log("imported data from:", name, "(#" + n + ")");
});


