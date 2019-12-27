import * as httpResponse from "../response/response";

import usersStorage from '../db/usersStorage.js';

const stringType = "string";
const numberType = "number";

const NAME = 'name';
const DESCRIPTION = 'description';
const ORIGIN_COUNTRY = 'originCountry';
const HARVEST_SEASON = 'harvestSeason';
const CAFFEINE_CONTENT = 'caffeineContent';
const AUTHOR_ID = 'authorId';

module.exports = {
    isAnyRequiredFieldMissingTea: function (reqBody, response) {
        if (!reqBody.name) {
            httpResponse.badRequestOnMissingParam(response, NAME);
            return true;
        } else if (!reqBody.description) {
            httpResponse.badRequestOnMissingParam(response, DESCRIPTION);
            return true;
        } else if (!reqBody.originCountry) {
            httpResponse.badRequestOnMissingParam(response, ORIGIN_COUNTRY);
            return true;
        } else if (!reqBody.harvestSeason) {
            httpResponse.badRequestOnMissingParam(response, HARVEST_SEASON);
            return true;
        } else if (!reqBody.caffeineContent) {
            httpResponse.badRequestOnMissingParam(response, CAFFEINE_CONTENT);
            return true;
        } else if (!reqBody.authorId) {
            httpResponse.badRequestOnMissingParam(response, AUTHOR_ID);
            return true;
        }

        return false;
    },

    isAnyFieldWrongParamTypeTea: function (reqBody, response) {
        if (!isString(reqBody.name)) {
            httpResponse.badRequestOnInvalidParamType(response, NAME, stringType);
            return true;
        } else if (!isString(reqBody.description)) {
            httpResponse.badRequestOnInvalidParamType(response, DESCRIPTION, stringType);
            return true;
        } else if (!isString(reqBody.originCountry)) {
            httpResponse.badRequestOnInvalidParamType(response, ORIGIN_COUNTRY, stringType);
            return true;
        } else if (!isString(reqBody.harvestSeason)) {
            httpResponse.badRequestOnInvalidParamType(response, HARVEST_SEASON, stringType);
            return true;
        } else if (!isNumber(reqBody.caffeineContent)) {
            httpResponse.badRequestOnInvalidParamType(response, CAFFEINE_CONTENT, numberType);
            return true;
        } else if (!isUUID(reqBody.authorId)) {
            httpResponse.badRequestOnInvalidParamType(response, AUTHOR_ID, 'uuid');
            return true;
        }

        return false;
    },

    isAuthorNotFound: function (authorId, response) {
        if (!usersStorage.find(user => user.id === authorId)) {
            httpResponse.notFound(response, `User with id: ${authorId} `);
            return true;
        }
        return false;
    },

    isLinkOk: function (imageLink, response) { //TODO extract to separate validation class
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

function isUUID(id) {
    const regExp = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    return regExp.test(id)
}