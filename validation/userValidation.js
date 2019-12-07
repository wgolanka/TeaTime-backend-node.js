import * as httpResponse from "../response/response";

const stringType = "string";

const NICK = 'nick';
const EMAIL = 'email';
const DESCRIPTION = 'description';

module.exports = {
    isAnyRequiredFieldMissingUser: function (reqBody, response) {
        if (!reqBody.nick) {
            httpResponse.badRequestOnMissingParam(response, NICK);
            return true;
        } else if (!reqBody.email) {
            httpResponse.badRequestOnMissingParam(response, EMAIL);
            return true;
        } else if (!reqBody.description) {
            httpResponse.badRequestOnMissingParam(response, DESCRIPTION);
            return true;
        }

        return false;
    },

    isAnyFieldWrongParamTypeUser: function (reqBody, response) {
        if (!isString(reqBody.nick)) {
            httpResponse.badRequestOnInvalidParamType(response, NICK, stringType);
            return true;
        } else if (!isString(reqBody.email)) {
            httpResponse.badRequestOnInvalidParamType(response, EMAIL, stringType);
            return true;
        } else if (!isString(reqBody.description)) {
            httpResponse.badRequestOnInvalidParamType(response, DESCRIPTION, stringType);
            return true;
        }

        return false;
    }
};

function isString(responseValue) {
    return typeof responseValue === stringType;
}