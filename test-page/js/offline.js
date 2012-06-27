// scope our features/functions 

beerApp.db = new Lawnchair( {name:'beerApp.db'}, function(e){
	console.log('Lawnchair (and beers) are open');
});

// saving beers per their ID
beerApp.db.saveBeer = function(beer) {
	var beerStr = JSON.stringify(beer);
	var beerId  = beer.beerId;
	if (beer.hasOwnProperty("id")) {
		beerId = beer.id;
	}
	
	beerApp.db.save( { key: beerId, value: beerStr } , function(tmpData) {
		var beerInfo = $.parseJSON(tmpData.value);
		beerApp.tmpSaveId = beerInfo.beerId;
	});
}

// Get all beers
beerApp.db.allBeers = function() {
	console.log("==== Get All the beers from our local data ====");	
	var items = beerApp.db.all(function(arr) {
	  arr.forEach( function(entry) {
	    console.log("BeerId: " + entry.key + " value:" + entry.value);
	  });
	});
}

// find specific beer
beerApp.db.getBeer = function(beerId) {
    beerApp.db.get(beerId, function(tmp) {
    	if (tmp !== undefined && tmp !== null) {
        	console.log('We got back beer.Id: ' + tmp.key + " with these properties: "+ tmp.value);
        	beerApp.tmpGetId = tmp.key;
    	}
    	else {
    		console.warn('Opss... Could not find locally beerId');
    	}
    });
}

// remove everything to keep a clean yard
beerApp.db.deleteAll = function() {
    beerApp.db.nuke();
    console.log ("* we clean all our local data");
}