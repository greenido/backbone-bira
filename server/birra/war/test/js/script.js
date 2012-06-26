/*
  This file contain HTML5 app that use jQuery with GAE REST API
	Author: Ido Green
  Date: May 2012

ToDos:
1. LawnChair - add config for app and save all beers in indexedDB.
2. Geo - maps for the location.
3. WebIntent - share

Oauth - https://code.google.com/p/google-api-javascript-client/wiki/Samples

*/

// scope our features/functions 
var beerApp = {};

//
// Constants
//
beerApp.callingServerHtml = '<p id="spinner"><img src="img/loader.gif"/></p>';

// prod: beerdemo1.googleplex.com 
var proxyServer = "";
if (document.URL.indexOf("beerdemo1") < 0) {
  // we are in dev mode - let's use our little proxy
  proxyServer = 'curl_proxy.php?url=';
}

//
// Entry points to the API
//
beerApp.serverUrl = proxyServer + 
        'https://beerdemo1.googleplex.com/_ah/api/beer/v1/beer';
beerApp.searchUrl = proxyServer + 
        'https://beerdemo1.googleplex.com/_ah/api/beer/v1/search'; 
beerApp.commentsUrl = proxyServer + 
        'https://beerdemo1.googleplex.com/_ah/api/beer/v1/comments'
beerApp.commentManUrl = proxyServer + 
        'https://beerdemo1.googleplex.com/_ah/api/beer/v1/comment'
beerApp.cursor = undefined;

beerApp.location = function(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      beerApp.curLocation = position.coords.latitude + " , "+ position.coords.longitude;
      console.log (" TODO - show on a map | cur Lat: "+ position.coords.latitude +
                   " Long: "+ position.coords.longitude);

    }, function(error) {
      console.error("Error occurred. The code: " + error.code);
      console.log("error.code can be: \
        0: unknown error \
        1: permission denied \
        2: position unavailable (error response from locaton provider) \
        3: timed out");
    });
  }
}

// clear the values of the beer modal. Useful before enteting a new beer
beerApp.clearFields = function() {
  $("#beerDetailsModal input[id^='beer']").each(function() {      
    $(this).val("");
  });
}

// clear the beer's comment modal.
beerApp.clearCommentsFields = function() {
  $("#beerCommentsModal input[id^='beer']").each(function() {      
    $(this).val("");
  });
  $("#beerCommentId").val($("#gbeerId").val());
}

// Show a list of beers on our page
beerApp.showList = function(data) {
  $("#spinner").remove();
  if (data.error) {
    $('<h3/>', {
      html: "Could not find beer: " +$("#gbeerId").val()
    }).appendTo('#results');
    return;
  }

  // We check for items because there are cases where we get errors in 'data'
  if (data && data.items) { 
    var beers = data.items;
    var items = [];
    
    // lets save the cursor so we could pagination on the list
    beerApp.cursor = data.cursor;

    $.each(beers, function(key, val) {
      var details = "<div class='beerDetails'>";
      for (var prop in val) {
        details += prop + ": " + val[prop] + "<br/>";
      }
      details += "</div>";
      items.push('<li><img src="img/88-beer-mug.png"/><span class="label label-warning">' + val.name + 
        '</span> - Id: ' + val.beerId + '<br/>' + details + '</li>');
    });

    $('<ol/>', {
      'class': 'beerItem',
      html: items.join('')
    }).appendTo('#results');

    // If we have more results 
    if (beerApp.cursor !== undefined) {
      // lets add pagination
      var pagingHTML = '<ul class="pager"> \
        <li> \
          <button class="btn btn-large beerListBut">More &rarr;</button> \
        </li> \
      </ul>';
      $("#results").append(pagingHTML);
    }
  }
  else if (data && !data.items) {
    // just one beer so data.items is undefined
    var details = "<div class='beerDetails'>";
      for (var prop in data) {
        details += prop + ": " + data[prop] + "<br/>";
      }
      details += "</div>";
    $('#results').append('<img src="img/88-beer-mug.png"/><span class="label label-warning">' + data.name + 
        '</span> - Id: ' + data.beerId + '<br/>' + details);
  }
}

// TODO:
// ================ Google API ================ 
// API Explorer:
// https://code.google.com/apis/explorer/?base=https://beerdemo1.googleplex.com/_ah/api#_s=beer&_v=v1

// Load our service
function loadGapi() {
  // Set the API key
  gapi.client.setApiKey('AIzaSyD_mrsCOGa_cip-_O9YzmruYQ831uQcqPE');
  // Set: name of service, version and callback function
  gapi.client.load('beer', 'v1', getBeers);
}

// return a list of beers
function getBeers() {
   var req = gapi.client.beer.beers.list();
   req.execute(function(response) {
   console.log("Beers: " +  JSON.stringify(response));
  });
}

// ================ Google API ================ 

//
// Start the party
//
$(function() {
  // init data/UI
  beerApp.location();
  $("a").tooltip();
  $(".alert").hide();

  //
  // Our search after (good) beers
  // 
  // TODO: show the power of: https://code.google.com/apis/explorer/?
  // base=https://beerdemo1.googleplex.com/_ah/api#_s=beer&_v=v1&_m=beers.search
  // &query=numberOfDrinks%20%3E%2010%20AND%20%20score%20%3E%201
  //
  $("#searchBeer").keydown(function(event) {
    if (event.which == 13) {
        var searchTerm = encodeURIComponent($("#searchBeer").val());
        $('#results').html(beerApp.callingServerHtml);
        var req = gapi.client.beer.beers.search( {'query' : searchTerm});
        req.execute(function(searchOutput) {
          beerApp.showList(searchOutput);  
        });

      // Old jQuery code:
      //   $.ajax({
      //   url:  beerApp.searchUrl + "?query_string='" + searchTerm + "'",
      //   dataType: 'json',
      //   contentType: 'application/json',
      //   type: 'GET',
      //   success: function(data) {
      //     beerApp.showList(data);
      //   },
      //   error: function(xhr, ajaxOptions, thrownError) {
      //     console.error("Could not fetch beer: " + $("#gbeerId").val() + 
      //       " Error: " + xhr.status) + " err thrown: " + thrownError;
      //     $('#alertContent').html("Could not get beer: " + $("#gbeerId").val());
      //     $('.alert').show();
      //   }
      // });
    }
  });


  //
  // Updating/Adding beer 
  //
  $("#beerDetailsModalBut").click(function(data) {
    console.log("Fetch the beer and show its data in our dialog");	
    var beerId = $("#gbeerId").val();
    var params = '{"beerId": "' + beerId + '"}'; 

    $('#results').html(beerApp.callingServerHtml);

    var req = gapi.client.beer.beers.get( {'beerId' : beerId});
    req.execute(function(data) {
      $("#spinner").remove();
      if (data.code >= 400) {
        // we have an error(s)
        $('#alertContent').html("Error: " + data.message);
        $('.alert').show();
        return;
      }

      if (data) {
        data = data.items[0];
      }
      if (data.beerId) {
        $("#beerId").val(data.beerId);  
        $("#beerName").val(data.name); 
        $("#beerScore").val(data.score);
        $("#beerScoreText").val(data.score);
        $("#beerLocation").val(data.location);
        $("#beerKind").val(data.kindOfBeer);
          //TODO:
          // $("#beerDesc").val(data.);               
        // BeerNumDrinks.select
        $('#beerDetailsModal').modal('show');
      }
      else {
        $('#alertContent').html("Could not get beer: " + $("#gbeerId").val());
        $('.alert').show();
      } 
    });

    // $.ajax({
    //   url: beerApp.serverUrl + "s&postData=" + params,
    //   dataType: 'json',
    //   contentType: 'application/json',
    //   type: 'POST',
    //   data: params,
    //   success: function(data) {
       
    //     $("#spinner").remove();
    //     if (data && data.id) {
    //       $("#beerId").val(data.id);  
    //       $("#beerName").val(data.name); 
    //       $("#beerScore").val(data.score);
    //       $("#beerScoreText").val(data.score);
    //       $("#beerLocation").val(data.location);
    //       $("#beerKind").val(data.kindOfBeer);
    //       //TODO:
    //       // $("#beerDesc").val(data.);               
    //       // BeerNumDrinks.select
    //       $('#beerDetailsModal').modal('show');
    //     }
    //     else {
    //       $('#alertContent').html("Could not get beer: " + $("#gbeerId").val());
    //       $('.alert').show();
    //     }
    //   },
    //   error: function(xhr, ajaxOptions, thrownError) {
    //     $("#spinner").remove();
    //     console.error("Could not fetch beer: " + $("#gbeerId").val() + 
    //       " Error: " + xhr.status) + " err thrown: " + thrownError;
    //     $('#alertContent').html("Could not get beer: " + $("#gbeerId").val());
    //     $('.alert').show();
    //   }
    // });


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
  // Save beer new/update
  //
  $("#saveBeer").click(function() {
    console.log("Save the beer...");
    var features = {};

    // extract all the info from the form's fields
    $("#beerDetailsModal input[id^='beer']").each(function() {      
      features[$(this).attr('name')] = $(this).val();
    });
    delete features['undefined'];

    // Get the select value as well.
    features[$('#BeerNumDrinks').attr('name')] = $('#BeerNumDrinks').val();
    //var json = JSON.stringify(features); 
    var req;
    // In case we have an empty beerId,
    // let's not send it, so the server will 'know'
    // it's a new beer
    if ( !features['beerId']) {
      delete features['beerId'];

      var tmpImg = $('#imgTesT');
      var beerImg = getBase64Image(tmpImg);
      features['picture'] = beerImg;
      req = gapi.client.beer.beers.add( features );
    }
    else {
      // It's an update of a beer
      req = gapi.client.beer.beers.update( features ); 
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
          tmpHTML += 'id: ' + data.beerId;
        }
        $('#results').html("");
        $('#alertContent').html(tmpHTML);
        $('.alert').show();

    });

    // $.ajax({
    //   url: beerApp.serverUrl + "&postData="+json,
    //   dataType: 'json',
    //   contentType: 'application/json',
    //   type: "POST",
    //   data: json,
    //   success: function(data) {
    //     var tmpHTML;
    //     if (data.error && data.error.code > 200) {
    //       console.error("Err Code: " + data.error.code + " Err: " + data.error.message);
    //       tmpHTML = data.error.message;
    //     }
    //     else {
    //       tmpHTML = '<h4>Your Beer is Safe</h4>';
    //       tmpHTML += "<img src='img/beer24.jpg'/>"
    //       tmpHTML += 'id: ' + data.beerId;
    //     }
    //     $('#results').html("");
    //     $('#alertContent').html(tmpHTML);
    //     $('.alert').show();
    //   },

    //   error: function(xhr, ajaxOptions, thrownError) {
    //     console.error("Err status: " + xhr.status) + " err: " + thrownError;
    //      $('#alertContent').html("Could not save - please try again later...");
    //      $('.alert').show();
    //   }
    // });

    $('#beerDetailsModal').modal('hide');
  });

  $("#beerScore").change(function() {
    $("#beerScoreText").val($("#beerScore").val());
  })

  //
  // Show Beer(s) in a list format
  //
  $(".beerListBut").live("click", function() {
    var params  = '';
    var tmpUrl  = beerApp.serverUrl + "s"; // it's beers not just one beer.
    var typeReq = "GET";
    var maxBeers = $("#listNumDrinks").val();
    if ($(this).data("onebeer") === 1 && $("#gbeerId").val()) {
        typeReq = "POST";
        params  = '{"beerId":"' + $("#gbeerId").val() + '"}';
        tmpUrl += "&postData=" + params; 
    }
    else {
      if (beerApp.cursor !== undefined) {
        tmpUrl += "&cursor=" + beerApp.cursor;
      }
      tmpUrl += "&limit=" + maxBeers;
    }
    
    $('#results').html(beerApp.callingServerHtml);
    var req = gapi.client.beer.beers.list({
      'limit' : maxBeers,
      'cursor': beerApp.cursor
    });

    req.execute(function(data) {
      beerApp.showList(data);  
    });

    // $.ajax({
    //   url: tmpUrl,
    //   dataType: 'json',
    //   contentType: 'application/json',
    //   type: typeReq,
    //   data: params,
    //   success: function(data) {
    //     beerApp.showList(data);
    //   },
    //   error: function(xhr, ajaxOptions, thrownError) {
    //     $("#spinner").remove();
    //     console.error("Beer list error: " + xhr.status) + " err: " + thrownError;
    //     $('<h3/>', {
    //         html: "Could not find beerId: " +$("#gbeerId").val()
    //       }).appendTo('#results');
    //   }
    // });


  }); // end of beer lists


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

      var req = gapi.client.beer.comments.list({
        'beerId': $("#gbeerId").val(),
        'limit' : 10
       // 'cursor': beerApp.cursor
      });

      req.execute(function(data) {
        $("#spinner").remove();

        if (data.error) {
          $('<h3/>', {
            html: "Could not find comments for beerId: " +$("#gbeerId").val() +
            " Err:" + data.message
          }).appendTo('#results');
          return;
        }

        if (data && data.items) { 
          var comments = data.items;
          var items = [];
          $.each(comments, function(key, val) {
          
          var details = "<div class='beerComm'>";
          for (var prop in val) {
            if (prop !== "beerId") {
              if (prop === "date") {
                details += "(" + decodeURIComponent(val[prop]) + ")<br/>";
              }
              else {
                details += prop + ": " + val[prop] + "<br/>";
              }
            }
          }
          details += "</div>";
          items.push('<li><img src="img/beer24.jpg"/><span class="label label-warning">' + 
            val.beerId +  
            '</span><br/>' + details + '</li>');
          });
          $('<ol/>', {
            'class': 'beerItem',
            html: items.join('')
          }).appendTo('#results');
        }
      });

      // $.ajax({
      //   url: beerApp.commentsUrl + "?beerId=" + $("#gbeerId").val(),
      //   dataType: 'json',
      //   contentType: 'application/json',
      //   type: "GET",
      //   success: function(data) {
      //     $("#spinner").remove();
      //     if (data.error) {
      //       $('<h3/>', {
      //         html: "Could not find comments for beerId: " +$("#gbeerId").val()
      //       }).appendTo('#results');
      //       return;
      //     }

      //     if (data && data.items) { 
      //       var comments = data.items;
      //       var items = [];
      //       $.each(comments, function(key, val) {
            
      //       var details = "<div class='beerComm'>";
      //       for (var prop in val) {
      //         if (prop !== "beerId") {
      //           if (prop === "date") {
      //             details += "(" + decodeURIComponent(val[prop]) + ")<br/>";
      //           }
      //           else {
      //             details += prop + ": " + val[prop] + "<br/>";
      //           }
      //         }
      //       }
      //       details += "</div>";
      //       items.push('<li><img src="img/beer24.jpg"/><span class="label label-warning">' + 
      //         val.beerId +  
      //         '</span><br/>' + details + '</li>');
      //       });
      //       $('<ol/>', {
      //         'class': 'beerItem',
      //         html: items.join('')
      //       }).appendTo('#results');
      //     } // end of If
      //   },
      //   error: function(xhr, ajaxOptions, thrownError) {
      //     $("#spinner").remove();
      //     console.error("Beer list error: " + xhr.status) + " err: " + thrownError;
      //     $('<h3/>', {
      //         html: "Could not find beerId: " +$("#gbeerId").val()
      //       }).appendTo('#results');
      //   }
      // });
    }
  })

  //
  // comments
  //
  $("#beerAddComment").click(function(data) {
      beerApp.clearCommentsFields();
      $('#beerCommentsModal').modal('show');
    });

  $("#cancelCommentsBeer").click(function(data) {
      $('#beerCommentsModal').modal('hide');
    });

  $("#saveCommentsBeer").click(function() {
      console.log("Save the comment.");
    var features = {};

    var tmpDate = new Date();
    // we wish this format: Jun 1 2005 1:33PM
    tmpDate = tmpDate.format("mmm d yyyy h:MTT"); 

    features['date'] = tmpDate;
    features['comment']  = $("#beerComment").val();
    $("#beerCommentsModal input[id^='beer']").each(function() {      
      features[$(this).attr('name')] = $(this).val();
    });

    //var json = JSON.stringify(features); 
    $('#results').html(beerApp.callingServerHtml);

    var req = gapi.client.beer.comments.add(features);
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


    // $.ajax({
    //   url: beerApp.commentManUrl + "&postData="+json,
    //   dataType: 'json',
    //   contentType: 'application/json',
    //   type: "POST",
    //   data: json,
    //   success: function(data) {
        
    //   },

    //   error: function(xhr, ajaxOptions, thrownError) {
    //     $("#spinner").remove();
    //     console.error("Err status: " + xhr.status) + " err: " + thrownError;
    //      $('#alertContent').html("Could not save a comment - please try again later...");
    //      $('.alert').show();
    //   }
    // });

    $('#beerCommentsModal').modal('hide');
  });  


}); // end of the party
