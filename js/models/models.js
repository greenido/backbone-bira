window.Beer = Backbone.Model.extend({
    endpoint: function() {
        return gapi.client.birra.beers;
    },

    initialize: function () {
        this.validators = {};

        this.validators.beerName = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.score = function (value) {
            return value >= 0 && value <= 5 ? {isValid: true} : {isValid: false, message: "You must enter a score (1-5)"};
        };

        /*
        this.validators.country = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a country"};
        };
        */
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
		id: null,
		grapes: "",
		country: "",
		region: "",
		description: "",
		image: "",
        numberOfDrinks: 0,
        score: 0
    }
});

window.BeerCollection = Backbone.Collection.extend({
    model: Beer,
    endpoint: function() {
        return gapi.client.birra.beers;
    }

});