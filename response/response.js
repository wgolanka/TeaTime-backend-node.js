module.exports = {
    successWithResponse: function (response, objects, message) {
        return response.status(200).send({
            success: 'true',
            message: message,
            objects,
        });
    },

    badRequestOnMissingParam: function (response, paramName) {
        return response.status(400).send({
            success: 'false',
            message: paramName + ' is required'
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
    },
    successWithoutResponse: function (response, message) {
        return response.status(200).send({
            success: 'true',
            message: message,
        });
    }
};