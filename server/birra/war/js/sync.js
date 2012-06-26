
Backbone.sync = function(method, model, options) {

    var getValue = function(object, prop) {
        if (!(object && object[prop])) return null;
        return _.isFunction(object[prop]) ? object[prop]() : object[prop];
    };

    var endpoint = getValue(model, 'endpoint');

    var requestMap = {
        'create': endpoint.insert(model.toJSON()),
        'read'  : endpoint.list(),
        'update': endpoint.update(model.toJSON()),
        'delete': endpoint.delete({ id: model.id })
    };

    var parseMap = {
        'create' : function(data) {
            if (data.result) {
                options.success(data.result);
            } else {
                options.error(data);
            }
        },
        'read' : function(data) {
            if (data.items) {
                options.success(data.items);
            } else {
                options.error(data);
            }
        },
        'update' : function(data) {
            if (data.result) {
                options.success(data.result);
            } else {
                options.error(data);
            }
        },
        'delete' : function(data) {
            if (data.error) {
                options.error(data);
            } else {
                options.success();
            }
        }
    };


    var req = requestMap[method];
    req.execute(parseMap[method]);

    return req;

};
