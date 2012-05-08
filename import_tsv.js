var cradle = require('cradle');
var connection = new(cradle.Connection)("localhost", 5984);
var db = connection.database('ufo');
var firstRow = true;
var arrayOfKeys = new Array();

var keys = 0;

    // node samples/sample.js
    var csv = require('csv');
	
    csv()
    .fromPath(__dirname+'/emdata.tsv',{ delimiter: '\t' })
    .toPath(__dirname+'/emimport.json')
    .transform(function(data){
        data.unshift(data.pop());
        return data;
    })
    .on('data',function(data,index){ // push data to db
		if(firstRow){
			firstRow = false;
			for(var key in data){
				arrayOfKeys[keys] = data[keys];
				//console.log(arrayOfKeys[keys]);
				keys++;
			}
		} else {
			var i=0;
			var fixedData = {};
			for(var value in data){
				fixedData[arrayOfKeys[i]] = data[i]
				i++;
			}
			delete fixedData.Id; 
			fixedData.IncrementId = index;
			console.log(fixedData);
			//console.log('#'+index+' '+ fixedData);
			db.save(fixedData, function(er, ok){
				if (er) {
					console.log('ERROR'  + er.message);
					return;
    				// Handle error
				} else {
					//console.log('Success');
				}
			});
		}
    })
    .on('end',function(count){
        console.log('Number of lines: '+count);
    })
    .on('error',function(error){
        console.log(error.message);
    });
    
    // Print sth like:
    // #0 ["2000-01-01","20322051544","1979.0","8.8017226E7","ABC","45"]
    // #1 ["2050-11-27","28392898392","1974.0","8.8392926E7","DEF","23"]
    // Number of lines: 2
