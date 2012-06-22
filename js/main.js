var beers = null;
var app = null;

var AppRouter = Backbone.Router.extend({

	routes: {
		"" : "list",
		"beers/page/:page" : "list",
		"beers/add"  : "addBeer",
		"beers/:id"  : "beerDetails",
		"about" : "about"
	},

	initialize: function () {
		this.headerView = new HeaderView();
		$('.header').html(this.headerView.el);
	},

	list: function(page) {
		var p = page ? parseInt(page, 10) : 1;
		beers.fetch({
			success: function(){
				$("#content").html(new BeerListView({
					beerCollection: beers,
					page: p
				}).render().el);
			}
		});
		this.headerView.selectMenuItem('home-menu');
	},

	beerDetails: function (id) {
		$("#content").append(new BeerView({ model: beers.get(id) }).el);
		this.headerView.selectMenuItem();
	},

	addBeer: function() {
		var beer = new Beer();
		$('#content').append(new BeerView({
			model: beer
		}).el);
		this.headerView.selectMenuItem('add-menu');
	},

	about: function () {
		if (!this.aboutView) {
			this.aboutView = new AboutView();
		}
		$('#content').html(this.aboutView.el);
		this.headerView.selectMenuItem('about-menu');
	}

});

utils.loadTemplate(['HeaderView', 'BeerView', 'BeerListItemView', 'AboutView'], function() {

    app = new AppRouter();
    beers = new BeerCollection();

});

function initDropbox(id) {
    var dropbox = document.getElementById(id);

    // init event handlers
    dropbox.addEventListener("dragenter", dragEnter, false);
    dropbox.addEventListener("dragexit", dragExit, false);
    dropbox.addEventListener("dragover", dragOver, false);
    dropbox.addEventListener("drop", drop, false);

}

function dragEnter(evt) {
    evt.stopPropagation();
    evt.preventDefault();
}

function dragExit(evt) {
    evt.stopPropagation();
    evt.preventDefault();
}

function dragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
}

function drop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;
    var count = files.length;

    // Only call the handler if 1 or more files was dropped.
    if (count > 0)
        handleFiles(files);
}

function initProgressBar(title, maxValue, value) {
    if (value === undefined) {
        value = 0;
    }

    $("#progressbar > div").remove();

    var $input = $("<input>").attr("data-width", 100).attr("data-skin", "tron").attr("data-thickness", ".1")
        .attr("data-min", 0).attr("data-max", maxValue).val(value).knob();
    var $div = $("<div>").append($("<div>").addClass("title").text(title)).append($input);
    $("#progressbar").append($div).show();
    $(".popup").fadeIn();
}

function hideProgressBar() {
    $("#progressbar").hide();
}


function handleFiles(files) {
    var file = files[0];

    document.getElementById("droplabel").innerHTML = "Processing " + file.name;

    var reader = new FileReader();

    // init the reader event handlers
    reader.onprogress = handleReaderProgress;
    reader.onloadend = handleReaderLoadEnd;

    // begin the read operation
    reader.readAsDataURL(file);
}

function handleReaderProgress(evt) {
    if (evt.lengthComputable) {
        var loaded = (evt.loaded / evt.total);
    }
}

function handleReaderLoadEnd(evt) {
    console.log(evt.target.result);
}