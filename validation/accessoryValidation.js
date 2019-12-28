import * as httpResponse from "../response/response";

import * as validation from "../validation/allValidation.js"

const NAME = 'name';
const IS_NECESSARY = 'isNecessary';
const DESCRIPTION = 'description';
const PRICE_FROM = 'priceFrom';
const PRICE_TO = 'priceTo';

const stringType = "string";
const numberType = "number";
const booleanType = "boolean";

module.exports = {
    isAnyRequiredFieldMissingAccessory: function (reqBody, response) {
        if (!reqBody.name) {
            httpResponse.badRequestOnMissingParam(response, NAME);
            return true;
        } else if (!reqBody.description) {
            httpResponse.badRequestOnMissingParam(response, DESCRIPTION);
            return true;
        } else if (!reqBody.priceFrom) {
            httpResponse.badRequestOnMissingParam(response, PRICE_FROM);
            return true;
        } else if (!reqBody.priceTo) {
            httpResponse.badRequestOnMissingParam(response, PRICE_TO);
            return true;
        }

        return false;
    },

    isAnyFieldWrongParamTypeAccessory: function (reqBody, response) {
        if (!validation.isString(reqBody.name)) {
            httpResponse.badRequestOnInvalidParamType(response, NAME, stringType);
            return true;
        } else if (!validation.isBoolean(reqBody.isNecessary)) {
            httpResponse.badRequestOnInvalidParamType(response, IS_NECESSARY, booleanType);
            return true;
        } else if (!validation.isString(reqBody.description)) {
            httpResponse.badRequestOnInvalidParamType(response, DESCRIPTION, stringType);
            return true;
        } else if (!validation.isNumber(reqBody.priceFrom)) {
            httpResponse.badRequestOnInvalidParamType(response, PRICE_FROM, numberType);
            return true;
        }
        else if (!validation.isNumber(reqBody.priceTo)) {
            httpResponse.badRequestOnInvalidParamType(response, PRICE_TO, numberType);
            return true;
        }

        return false;
    },

    isBadPriceRange(response, priceFrom, priceTo) {
        if (!isRangeOk(priceFrom, priceTo)) {
            const message = `${priceFrom}, ${priceTo} invalid range`;
            httpResponse.badRequest(response, message);
            return true;
        }

        return false
    }
};

function isRangeOk(priceFrom, priceTo) {
    return priceFrom > 0 && priceFrom > 0 && priceTo >= priceFrom;
}