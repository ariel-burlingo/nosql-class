var cradle = require("cradle")
, util = require("util")
, fs = require("fs")
, csv = require("csv");
    
    csv()
    .fromPath(__dirname+'/sample.in')
    .toPath(__dirname+'/sample.out')
    .transform(function(data){
        data.unshift(data.pop());
        return data;
    })
    .on('data',function(data,index){
        console.log('#'+index+' '+JSON.stringify(data));
    })
    .on('end',function(count){
        console.log('Number of lines: '+count);
    })
    .on('error',function(error){
        console.log(error.message);
    });

//csv to json


function isdef(ob) {
if(typeof(ob) == "undefined") return false;
return true;
}
// rozdziela elementy
function splitCSV(str, sep) {
        for (var foo = str.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
            if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
                if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
                    foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
                } else if (x) {
                    foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
                } else foo = foo.shift().split(sep).concat(foo);
            } else foo[x].replace(/""/g, '"');
        } return foo;
    };

//wlasciwa konwersja csv do json'a
var csv2json = function(csvdata, args) {
args = args || {};
var delim = isdef(args.delim) ? args.delim : "\t";

var csvlines = csvdata.split("\n");
var csvheaders = splitCSV(csvlines[0], delim);
var csvrows = csvlines.slice(1, csvlines.length);

var ret = {};
ret.headers = csvheaders;
ret.rows = [];

for(var r in csvrows) {
if (csvrows.hasOwnProperty(r)) {
var row = csvrows[r];
var rowitems = splitCSV(row, delim);

// stop na koncu pliku
if(row.length == 0) break;

var rowob = {};
for(var i in rowitems) {
if (rowitems.hasOwnProperty(i)) {
var item = rowitems[i];

rowob[csvheaders[i]] = item;
}
}

ret.rows.push(rowob);
}
}

return ret;
};

// wpisywanie danych do bazy
var connection = new(cradle.Connection)("localhost", 5984);
var db = connection.database('ufo');

var couchimport = function(filename) {
//odczyt danych
console.log("Done something!");
  var data = fs.readFileSync(filename, "utf-8");
console.log("Done something!");
//konwersja do json'a
  var dane = csv2json(data);

  var counter = 0;

  for (var p in dane.rows) {
 
	 wpis = dane.rows[p];
		console.log(wpis);

      counter++;

      db.save(counter+'', wpis, function(er, ok) {
        if (er) {
          util.puts("Error: " + er);
          return;
        }
      });
    }
  return counter;
};
//lista plikow do wpisania do bazy
var filenames =  ["em_trimmed.tsv"];

filenames.forEach(function (name) {
  var n = couchimport(name);
  console.log("imported data from:", name, "(#" + n + ")");
});


