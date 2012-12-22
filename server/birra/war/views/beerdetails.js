window.BeerView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));

        this.image = $(this.el).find(".beer-selector img");
        this.image.attr("src", "data:image;base64," + this.model.get("image").value);
        //this.image.attr("src", this.model.get("image").value);

        var myLatlng = new google.maps.LatLng(this.model.get("latitude"),this.model.get("longitude"));
        var myOptions = {
            zoom: 8,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map($(this.el).find(".map").get(0), myOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            draggable: true
        });

        google.maps.event.addListener(marker, "dragend", _.bind(function() {
            this.model.set("latitude", marker.getPosition().lat());
            this.model.set("longitude", marker.getPosition().lng());
        }, this));

        return this;
    },

    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteBeer",
        "dragenter .beer-selector" : "preventDefault",
        "dragexit .beer-selector" : "preventDefault",
        "dragover .beer-selector" : "preventDefault",
        "drop .beer-selector" : "dropHandler"
    },

    preventDefault: function(event) {
        event.stopPropagation();
        event.preventDefault();
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.saveBeer();

        return false;
    },

    saveBeer: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('', false);
                utils.showAlert('Success!', 'Beer details were saved successfully.', 'alert-success');

            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteBeer: function () {
        this.model.destroy({
            success: function () {
                app.navigate("", false);
            }
        });
        return false;
    },

    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();

        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        var reader = new FileReader();
        reader.onloadend = _.bind(function () {
            this.image.attr('src', reader.result);

            this.model.set("image", { value : reader.result.split(",")[1] });
        }, this);

        reader.readAsDataURL(this.pictureFile);
    }

});