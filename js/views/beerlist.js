window.BeerListView = Backbone.View.extend({

    initialize: function () {
		this.beers = this.options.beerCollection;
    },

    render: function () {
        var len = this.beers.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new BeerListItemView({model: this.beers.models[i]}).render().el);
        }

        $(this.el).append(new Paginator({collection: this.beers, page: this.options.page}).render().el);

        return this;
    }
});

window.BeerListItemView = Backbone.View.extend({

    tagName: "li",

    className: "span3",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
		debugger;
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});