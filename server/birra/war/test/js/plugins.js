// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());


// place any jQuery/helper plugins in here, instead of separate, slower script files.

// scope our features/functions 
var beerApp = beerApp || {};

// Some help to offline capabilities
$.getScript("js/offline.js", function(){
  console.log("Lawnchair is loaded.");
});

//
// Constants
//
beerApp.callingServerHtml = '<p id="spinner"><img src="img/loader.gif"/></p>';

// prod: birra.googleplex.com 
var proxyServer = "";
if (document.URL.indexOf("birra") < 0) {
  // we are in dev mode
  proxyServer = 'curl_proxy.php?url=';
}

// we will use it for pagination        
beerApp.cursor = undefined;

// OAuth helper functions
var clientId = '18031058163.apps.googleusercontent.com';
var apiKey = 'AIzaSyCAlE-Rnz1Qmj_jvAmUXNM5-SYl8U0JUxk';
var scopes = 'https://www.googleapis.com/auth/userinfo.email';  

beerApp.checkAuth = function() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, beerApp.handleAuthResult);
}

beerApp.handleAuthResult = function (authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult) {
    authorizeButton.style.visibility = 'hidden';
    console.log("You are now logged in");
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = beerApp.handleAuthClick;
  }
}

beerApp.handleAuthClick = function(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, beerApp.handleAuthResult);
  return false;
}

// Get the geo location of our user so we could save it with the beers
beerApp.location = function(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      beerApp.curLocation = position.coords.latitude + "," +
                            position.coords.longitude;
      beerApp.lang = position.coords.latitude;
      beerApp.long = position.coords.longitude;
      console.log ("current position: Lat:  " + 
                  position.coords.latitude + " Long: " + 
                  position.coords.longitude);

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
    // TODO - change to new name
    beerApp.cursor = data.nextPageToken;

    // and give user the option to 'share' their best beer
    $("#shareBeer").live("click", function() {
      var beerDetails = "Check my beer: " + $("#shareBeer").data('beer') + "\n\nYou can enjoy rating beers at: https://birra-io2012.appspot.com/";
      var intent = new Intent(
            "http://webintents.org/share",
            "text/uri-list",
             beerDetails);
      window.navigator.startActivity(intent);
     });

    var firstBeer = true;
    $.each(beers, function(key, val) {
      var details = "<div class='beerDetails'>";
      var shareHtml = "";
       if (firstBeer) {
        shareHtml += "<button id='shareBeer' data-beer='" + val.beerName +
                " score:" + val.score + "'>Share Beer</button>";
        firstBeer = false;
      }
      details += "<pre>";
      var imgData64 = null;
      if (val['image'] !== null) {
        imgData64 = val['image']['value'];
      }
      delete val['image'];
      
      var dataStr = JSON.stringify(val, undefined, 2);
      details += syntaxHighlight(dataStr);
      details += "</pre></div>";
      var imgHtml = "<img src='img/beer-icon-36.png' alt='beer icon'/>";
      if (imgData64 !== undefined && imgData64 !== null) {
        imgHtml = "<img src='data:image/png;base64," + imgData64 + "' class='beerImgInList' />";
      }
      
      if (val !== undefined && val !== null) {
        items.push('<li>' + imgHtml +  '<span class="label label-warning">' + 
          val.beerName + '</span> - Id: ' + 
          val.id + shareHtml + '<br/>' + 
          details + '</li>');
      }
      shareHtml = "";
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
    var details = "<div class='beerDetails'><pre>";
    var dataStr = JSON.stringify(data, undefined, 5);
    details += syntaxHighlight(dataStr);
    details += "</pre></div>";

    $('#results').html('<img src="img/88-beer-mug.png"/><span class="label label-warning">' + data.beerName + 
        '</span> - Id: ' + data.id + '<br/>' + details);
  }
}

// Show a list of comments on our page
beerApp.showComments = function(data) {
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
    details += 'user email: ' + val['user']['email'];
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
  else {
    // got empty obj of comments
    $('<h3/>', {
      html: "There are no comments for beerId: " +$("#gbeerId").val()
    }).appendTo('#results');
  }
}


//
//
//
function dragImg() {
	var holder = document.getElementById('imgdrop');
	   
	if (typeof window.FileReader === 'undefined') {
	  console.warn ("Could not use FileReader in order to fetch the image");
	}
	 
	holder.ondragover = function () { 
		this.className = 'hover'; 
		return false; 
	};
	holder.ondragend = function () { 
		this.className = ''; 
		return false; 
	};

	// The heart of the drag and drop
	holder.ondrop = function (e) {
	  this.className = '';
	  e.preventDefault();

	  var file = e.dataTransfer.files[0],
	      reader = new FileReader();
	  reader.onload = function (event) {
	    console.log("Going to drop an image. event:"+event.target);
	    // let clean our space from old images
	    var dropZone = document.getElementById('imgdrop');
	    while (dropZone.firstChild) {
		  dropZone.removeChild(dropZone.firstChild);
		}

	    var imgElem = document.createElement('img');
	    imgElem.setAttribute('id', 'upImg');
	    imgElem.setAttribute('alt', 'Beer picture');
	    imgElem.setAttribute('src', event.target.result);
	    imgElem.setAttribute('width', 140);
	    imgElem.setAttribute('height', 100);
	    dropZone.appendChild(imgElem);
	    
	  };
	  console.log(file);
	  reader.readAsDataURL(file);
	  return false;
	};
}
// show json like a pro
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}


//
function getAddressFromGeoPoint(geoPoint, locationField) {
	// http://maps.googleapis.com/maps/api/geocode/json?latlng=57.14369,-2.22314&sensor=false
	var reqUrl = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + geoPoint + "&sensor=false&callback=stam";
	$.getJSON(reqUrl, function(results) {
	  var address = results[0].formatted_address;
	  locationField.val(address);
	  // $.each(results, function(key, val) {
	  // });

	});
}

//
function convertDataURIToBlob(dataURI, mimetype) {
  var BASE64_MARKER = ';base64,';
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  var bb = new BlobBuilder();
  bb.append(uInt8Array.buffer);

  return bb.getBlob(mimetype);
}

// Take an image and give us back its 64base text
function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};