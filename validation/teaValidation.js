import * as httpResponse from "../response/response";

const stringType = "string";
const numberType = "number";

module.exports = {
    isAnyRequiredFieldMissing: function (reqBody, response) {
        if (!reqBody.name) {
            httpResponse.badRequestOnMissingParam(response, 'name');
            return true;
        } else if (!reqBody.description) {
            httpResponse.badRequestOnMissingParam(response, 'description');
            return true;
        } else if (!reqBody.originCountry) {
            httpResponse.badRequestOnMissingParam(response, 'originCountry');
            return true;
        } else if (!reqBody.harvestSeason) {
            httpResponse.badRequestOnMissingParam(response, 'harvestSeason');
            return true;
        } else if (!reqBody.caffeineContent) {
            httpResponse.badRequestOnMissingParam(response, 'caffeineContent');
            return true;
        }

        return false;
    },

    isAnyFieldWrongParamType: function (reqBody, response) {
        if (!isString(reqBody.name)) {
            httpResponse.badRequestOnInvalidParamType(response, 'name', stringType);
            return true;
        } else if (!isString(reqBody.description)) {
            httpResponse.badRequestOnInvalidParamType(response, 'description', stringType);
            return true;
        } else if (!isString(reqBody.originCountry)) {
            httpResponse.badRequestOnInvalidParamType(response, 'originCountry', stringType);
            return true;
        } else if (!isString(reqBody.harvestSeason)) {
            httpResponse.badRequestOnInvalidParamType(response, 'harvestSeason', stringType);
            return true;
        } else if (!isNumber(reqBody.caffeineContent)) {
            httpResponse.badRequestOnInvalidParamType(response, 'caffeineContent', numberType);
            return true;
        }

        return false;
    },

    isLinkOk: function (imageLink, response) {
        if (imageLink && !isString(imageLink) && !stringIsAValidUrl(imageLink)) {
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

function isNumber(responseValue) {
    return typeof responseValue === numberType;
}

function isString(responseValue) {
    return typeof responseValue === stringType;
}