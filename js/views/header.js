window.HeaderView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    events: {
      "keydown" : "search"
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    },
    search: function(e) {
        if (e.keyCode == 13) {

            gapi.client.birra.beer.search({term: $(this.el).find("input").val()}).execute(function(data) {
                beers = new BeerCollection(data.items);
                app.populate();
            });

        }
    }

});