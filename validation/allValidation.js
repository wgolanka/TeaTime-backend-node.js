import * as httpResponse from "../response/response";

const stringType = "string";
const numberType = "number";
const booleanType = "boolean";

module.exports = {

    isNumber: function (value) {
        return typeof value === numberType || value instanceof Number
    },

    isString: function (value) {
        return typeof value === stringType || value instanceof String;
    },

    isUUID: function (id) {
        const regExp = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        return regExp.test(id)
    },

    isBoolean: function (value) {
        return typeof value === booleanType || value instanceof Boolean;
    },

    isLinkOk: function (imageLink, response) {
        if (imageLink && !this.isString(imageLink) && !stringIsAValidUrl(imageLink)) {
            httpResponse.badRequestOnInvalidUrl(response, imageLink);
            return false;
        }

        return true;
    }
};

const stringIsAValidUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (error) {
        return false;
    }
};