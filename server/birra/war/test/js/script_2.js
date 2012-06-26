//
// ================ Google API ================ 
// API Explorer:
// https://developers.google.com/apis-explorer/?base=https://birra.googleplex.com/_ah/api#p/birra/v1/
//
//

// scope our features/functions 
var beerApp = {};

// Load service
function loadGapi() {
  // Set the API key
  gapi.client.setApiKey('AIzaSyD_mrsCOGa_cip-_O9YzmruYQ831uQcqPE');
  // Set: name of service, version and callback function beerdemo1 birra
  gapi.client.load('birra', 'v1', getBeers);
}

// return a list of beers
function getBeers() {
  //
  //
  //beers.list(); listBeer
  //
   var req = gapi.client.birra.beers.list();
   req.execute(function(data) {
    $("#results").html('');
    showList(data); 
  });
}

function showList(data) {
  if (data && data.items) { 
    var beers = data.items;
    var items = [];
    $.each(beers, function(key, val) {
      var details = "<div class='beerDetails'><pre>";
      for (var prop in val) {
          if (prop === "beerId") {
            details += "beerId: " + val[prop.id] + "<br/>";
          }
          else {              
            details += prop + ": " + val[prop] + "<br/>";
          }
      }
      details += "</pre></div>";
      items.push('<li><img src="http://db.tt/naae4baA"/><span class="label label-warning">' + val.beerName + 
        '</span> - Id: ' + val.id + '<br/>' + details + '</li>');
    });

    $('<ol/>', {
      'class': 'beerItem',
      html: items.join('')
    }).appendTo('#results');
  }
}