/*
This file contain HTML5 app that use Gapi js client lib with GAE REST API
Source: https://code.google.com/u/bma@google.com/p/beeriodemo/
Author: Ido Green
Date: May 2012

Key features:
1. LawnChair - add config for app and save all beers in indexedDB.
2. Geo - maps for the location.
3. WebIntent - Sharing.

* Oauth - https://code.google.com/p/google-api-javascript-client/wiki/Samples
* http://code.google.com/p/google-api-javascript-client/

Yep: simplicity is the ultimate sophistication
https://developers.google.com/apis-explorer/?base=https://birra-io2012.appspot.com/_ah/api#p/birra/v1/

http://developers.google.com/apis-explorer/?base=https://beerdemo1.googleplex.com/_ah/api#p/birra/v1/

*/


// ================ Google API ================ 
//
// Load our service
function loadGapi() {
  // Set the API key  AIzaSyAlZqy1ElhVN_Hbutey0xNabhZ14bEpcAo
  // Ido - AIzaSyD_mrsCOGa_cip-_O9YzmruYQ831uQcqPE
  gapi.client.setApiKey('AIzaSyAlZqy1ElhVN_Hbutey0xNabhZ14bEpcAo');
  // Set: name of service, version and callback function
  gapi.client.load('birra', 'v1', getBeers);
}

// return a list of beers
function getBeers() {
  var req = gapi.client.birra.beers.list(); 
  req.execute(function(data) {
    console.log("-- We have " + data.items.length + " beers --");
    //console.log("Beers: " +  JSON.stringify(data));  
     
    // var beers = data.items;
    // var i=1;
    // $.each(beers, function(key, val) {
    //   //var details = JSON.stringify(val);
      
    //   console.log(i + ") Saving locally: " + val.id + " Name: "+ val.beerName) ;
    //   i++;
    //   //offline - save beers
    //   beerApp.db.saveBeer(val);
    // });

  });
}
// ================ Google API ================ 


// start the party
// 
$(function() {
  // init data/UI
  beerApp.location();
  dragImg();

  $("a").tooltip();
  $(".alert").hide();

  //
  // Search after (good) beers
  // 
  // The power of: https://code.google.com/apis/explorer/?base=https://beerdemo1.googleplex.com/_ah/api#_s=beer&_v=v1&_m=beers.search&query=numberOfDrinks%20%3E%2010%20AND%20%20score%20%3E%201
  //
  $("#searchBeer").keydown(function(event) {
    if (event.which == 13) {
        var searchTerm = $("#searchBeer").val(); 
        $('#results').html(beerApp.callingServerHtml);
        var req = gapi.client.birra.beer.search( {'term' : searchTerm});
        req.execute(function(searchOutput) {
          beerApp.showList(searchOutput);  
        });
    }
  });

  // set our last item back
  $("#gbeerId").val(localStorage.getItem("gbeerId"));

  // save our id for the future
  $("#gbeerId").blur(function() {
    localStorage.setItem("gbeerId", this.value);
  });

  //
  // Updating/Adding beer 
  //
  $("#beerDetailsModalBut").click(function(data) {
    console.log("Fetch the beer and show its data in our dialog");	
    var beerId = $("#gbeerId").val();
    
    $('#results').html(beerApp.callingServerHtml);

    var req = gapi.client.birra.beers.get( {'id' : beerId});
    req.execute(function(data) {
      $("#spinner").remove();
      if (data.code >= 400) {
        // we have an error(s)
        $('#alertContent').html("Error: " + data.message);
        $('.alert').show();
        return;
      }
     
      if (data.id) {
        $("#beerId").val(data.id);  
        $("#beerName").val(data.beerName); 
        $("#beerScore").val(data.score);
        $("#beerScoreText").val(data.score);
        var tmpLocation = "32.06,34.77"; // default is Google office in TLV
        if (data.latitude && data.longitude) {
            tmpLocation = data.latitude + "," + data.longitude;
            $("#beerLocation").val(tmpLocation);
        }
        
        var mapImg = '<img border=0 src="http://maps.googleapis.com/maps/api/staticmap?center=' +
            tmpLocation + '&zoom=14&size=262x112&maptype=roadmap&markers=color:blue%7Clabel:S%7C' + 
            tmpLocation + '&sensor=true"/>';
        $("#localMap").html(mapImg);
        $("#beerKind").val(data.kindOfBeer);

        var imgData64 = null;
        if (data.image !== null && data.image.value !== null) {
          imgData64 = data.image.value;
          imgHtml = "<img src='data:image/png;base64," + imgData64 + "' id='upImg'/>";
          $('#imgdrop').html(imgHtml);
        }
        
        $('#beerDetailsModal').modal('show');
      }
      else {
        $('#alertContent').html("Could not get beer: " + $("#gbeerId").val());
        $('.alert').show();
      } 
    });
  });
	
  // Get One beer
  $(".oneBeerBut").click(function(data) {
    beerApp.cursor = undefined;
    $('#results').html(beerApp.callingServerHtml);
    var req = gapi.client.birra.beers.get({
      'id' :  $("#gbeerId").val()
    });

    req.execute(function(data) {
      beerApp.showList(data);  
    });

  });

  // Delete beer
  $("#beerDelBut").click(function() {
    $('#results').html(beerApp.callingServerHtml);
    var req = gapi.client.birra.beers.delete({
      'id' :  $("#gbeerId").val()
    });

    req.execute(function(data) {
      beerApp.showList(data);  
    });
  });

  // Add new beer
  $("#beerAddBut").click(function(data) {
    beerApp.clearFields();
    $("#beerLocation").val(beerApp.curLocation);
    $("#beerScore").change();

    // Using our Geo information to have a small map of the area around us
    var mapImg = '<img border=0 src="http://maps.googleapis.com/maps/api/staticmap?center=' +
      beerApp.curLocation + '&zoom=14&size=262x112&maptype=roadmap&markers=color:blue%7Clabel:S%7C' + 
      beerApp.curLocation + '&sensor=true"/>';
    $("#localMap").html(mapImg);

    $('#beerDetailsModal').modal('show');

  });

  // Actions for the modal
  $("#cancelBeer").click(function(data) {
    beerApp.clearFields();
    $('#beerDetailsModal').modal('hide');
  });

  //
  // Save beer - Add new or update
  //
  $("#saveBeer").click(function() {
    console.log("Going to save the beer...");
    var features = {};

    // extract all the info from the form's fields
    $("#beerDetailsModal input[id^='beer']").each(function() {      
      features[$(this).attr('name')] = $(this).val();
    });
    delete features['undefined'];
    var latLong = features['location'].split(",");
    delete features['location'];

    // Get the select value as well.
    features[$('#BeerNumDrinks').attr('name')] = $('#BeerNumDrinks').val();
    if ($('#upImg')[0] !== null) { 
      var tmpImg = $('#upImg')[0]; // keep it one image per beer
      var beerImg64 = getBase64Image(tmpImg);
      features['image'] =  {"value" : beerImg64};
    } 
    var req;
    if ( !features['beerId']) {
      // In case we have an empty beerId, do not send it, 
      // so the server will take it as a new beer
      delete features['beerId'];
      
      features['latitude'] =  beerApp.lang;
      features['longitude'] = beerApp.long;

      req = gapi.client.birra.beers.insert( features );
    }
    else {
      // It's an update of a beer
      features['id']        = features['beerId'];
      delete features['beerId'];
      features['latitude']  = latLong[0];
      features['longitude'] = latLong[1];
      req = gapi.client.birra.beers.update( features ); 
    }
    
    req.execute(function(data) {
      var tmpHTML;
        if (data.error && data.error.code > 200) {
          console.error("Err Code: " + data.error.code + " Err: " + data.error.message);
          tmpHTML = data.error.message;
        }
        else {
          tmpHTML = '<h4>Your Beer is Safe</h4>';
          tmpHTML += "<img src='img/beer24.jpg'/>"
          tmpHTML += 'id: ' + data.id + " Name: " + data.beerName;
        }
        $('#results').html("");
        $('#alertContent').html(tmpHTML);
        $('.alert').show();

    });

    $('#beerDetailsModal').modal('hide');
  });

  $("#beerScore").change(function() {
    $("#beerScoreText").val($("#beerScore").val());
  })

  //
  // Show Beer(s) in a list format
  //
  $(".beerListBut").live("click", function() {
    var maxBeers = $("#listNumDrinks").val();   
    $('#results').html(beerApp.callingServerHtml);
    var req = gapi.client.birra.beers.list({
      'limit' : maxBeers,
      'cursor': beerApp.cursor
    });

    req.execute(function(data) {
      beerApp.showList(data);  
    });

  }); // end of beer lists


  //
  // save new comments 
  // oauth example
  //
  $("#saveCommentsBeer").click(function() {
    var features = {};

    var tmpDate = new Date();
    // Using format: Jun 1 2005 1:33PM
    tmpDate = tmpDate.format("mmm d yyyy h:MTT"); 

    features['date'] = tmpDate;
    features['comment']  = $("#beerComment").val();
    $("#beerCommentsModal input[id^='beer']").each(function() {      
      features[$(this).attr('name')] = $(this).val();
    });

    //var json = JSON.stringify(features); 
    $('#results').html(beerApp.callingServerHtml);

    var req = gapi.client.birra.beers.comments.insert(features);
    req.execute(function(data) {
      var tmpHTML;
      $("#spinner").remove();
      if (data.error && data.error.code > 200) {
        console.error("Err Code: " + data.error.code + " Err: " + data.error.message);
        tmpHTML = data.error.message;
      }
      else {
        tmpHTML = '<h4>Your great comment on beer ' + data.beerId + ' is Safe</h4>';
        tmpHTML += "<img src='img/beer-icon-36.png'/>"
      }
      $('#results').html("");
      $('#alertContent').html(tmpHTML);
      $('.alert').show(); 
    });  

    $('#beerCommentsModal').modal('hide');
  });  


  // Show comments on specific beer
  // Use - https://beerdemo1.googleplex.com/_ah/api/beer/v1/comments?beerId=3003'
  $("#beerComments").click(function() {
    if ($("#gbeerId").val() == undefined || $("#gbeerId").val() < 0) {
      console.error("Comments error - missing BeerId: " + $("#gbeerId").val() );
      $('<h3/>', {
        html: "Could not fetch comments for beerId: " + $("#gbeerId").val()
      }).appendTo('#results');
    } 
    else {
      // we are all good (more or less) fetch the comments
      $('#results').html(beerApp.callingServerHtml);

      var req = gapi.client.birra.beers.comments.list({
        'beerId': $("#gbeerId").val()
      });

      req.execute(function(data) {
        $("#spinner").remove();
        beerApp.showComments(data);
      });
    }
  })

  //
  // comments dialog actions
  //
  $("#beerAddComment").click(function(data) {
      beerApp.clearCommentsFields();
      beerApp.checkAuth();
      $('#beerCommentsModal').modal('show');
    });

  $("#cancelCommentsBeer").click(function(data) {
      $('#beerCommentsModal').modal('hide');
    });


  
}); // end of the party
