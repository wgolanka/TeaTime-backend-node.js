module.exports = {
    successWithResponse: function (response, objects, message) {
        return response.status(200).send({
            success: 'true',
            message: message,
            objects,
        });
    },

    successWithoutResponse: function (response, message) {
        return response.status(200).send({
            success: 'true',
            message: message,
        });
    },

    badRequestOnMissingParam: function (response, paramName) {
        return response.status(400).send({
            success: 'false',
            message: paramName + ' is required'
        });
    },

    badRequestOnInvalidParamType: function (response, paramName, type) {
        return response.status(400).send({
            success: 'false',
            message: paramName + ' should be a ' + type
        });
    },

    badRequestOnInvalidUrl: function (response, link) {
        return response.status(400).send({
            success: 'false',
            message: link + ' is not a valid url'
        });
    },

    notFound: function (response, name) {
        return response.status(404).send({
            success: 'false',
            message: name + ' not found',
        });
    }
};
