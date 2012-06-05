var AppRouter = Backbone.Router.extend({

  routes: {
    ""                  : "list",
    "beers/page/:page"	: "list",
    "beers/add"         : "addBeer",
    "beers/:id"         : "beerDetails",
    "about"             : "about"
  },

  initialize: function () {
    this.headerView = new HeaderView();
    $('.header').html(this.headerView.el);
  },

  list: function(page) {
    var p = page ? parseInt(page, 10) : 1;
    var beerList = new BeerCollection();
    beerList.fetch({
      success: function(){
        $("#content").html(new BeerListView({
          model: beerList, 
          page: p
        }).el);
      }
    });
    this.headerView.selectMenuItem('home-menu');
  },

  beerDetails: function (id) {
    var beer = new Beer({
      id: id
    });
    beer.fetch({
      success: function(){
        $("#content").html(new BeerView({
          model: beer
        }).el);
      }
    });
    this.headerView.selectMenuItem();
  },

  addBeer: function() {
    var beer = new Beer();
    $('#content').html(new BeerView({
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
  Backbone.history.start();
});