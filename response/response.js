const TRUE = 'true';
const FALSE = 'false';

module.exports = {
    successWithResponse: function (response, objects, message) {
        return response.status(200).send({
            success: TRUE,
            message: message,
            objects,
        });
    },

    successWithoutResponse: function (response, message) {
        return response.status(200).send({
            success: TRUE,
            message: message,
        });
    },

    badRequestOnMissingParam: function (response, paramName) {
        return response.status(400).send({
            success: FALSE,
            message: `${paramName} is required`
        });
    },

    badRequestOnInvalidParamType: function (response, paramName, type) {
        return response.status(400).send({
            success: FALSE,
            message: `${paramName} should be a ${type}`
        });
    },

    badRequestOnInvalidUrl: function (response, link) {
        return response.status(400).send({
            success: FALSE,
            message: `${link} is not a valid url`
        });
    },

    badRequest: function (response, message) {
        return response.status(400).send({
            success: FALSE,
            message: message
        });
    },

    notFound: function (response, name) {
        return response.status(404).send({
            success: FALSE,
            message: `${name} not found`,
        });
    }
};
