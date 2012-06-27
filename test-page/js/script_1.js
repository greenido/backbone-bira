
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
      items.push('<li><img src="img/b3_40.png"/><span class="label label-warning">' + val.beerName + 
        '</span> - Id: ' + val.id + '<br/>' + details + '</li>');
    });

    $('<ol/>', {
      'class': 'beerItem',
      html: items.join('')
    }).appendTo('#results');
  }
}

var apiUrl = "https://birra-io2012.appspot.com/_ah/api/birra/v1/beer";
$.ajax({
  url: apiUrl,
  dataType: 'json',
  contentType: 'application/json',
  type: "GET",
  success: function(data) {
    $('#results').html('');
    showList(data);
  },
  error: function(xhr, ajaxOptions, thrownError) {
    console.error("Beer list error: " + xhr.status) + " err: " + thrownError;
    $('<h3/>', {
        html: "Could not find beers"
      }).appendTo('#results');
  }
 
});
