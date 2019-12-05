import express from 'express';
import teaStorage from './db/teaStorage';
import bodyParser from 'body-parser';

const uuidv1 = require('uuid/v1');
const app = express();
const URL = require("url").URL;
const httpResponse = require('./response/response');

const stringType = "string";
const numberType = "number";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/teatime/tea/all', (request, response) => {
    return httpResponse.successWithResponse(response, teaStorage, 'teas retrieved successfully');
});

// TODO walidacja czy typ pola jest taki jak powinien być - oczekujemy wieku - powinien być int, w
//  wylaczyc przegladarkowa


function teaCheckAreRequiredParamsValid(reqBody, response) {
    if (!reqBody.name) {
        httpResponse.badRequestOnMissingParam(response, 'name');
        return false;
    } else if (!reqBody.description) {
        httpResponse.badRequestOnMissingParam(response, 'description');
        return false;
    } else if (!reqBody.originCountry) {
        httpResponse.badRequestOnMissingParam(response, 'originCountry');
        return false;
    } else if (!reqBody.harvestSeason) {
        httpResponse.badRequestOnMissingParam(response, 'harvestSeason');
        return false;
    } else if (!reqBody.caffeineContent) {
        httpResponse.badRequestOnMissingParam(response, 'caffeineContent');
        return false;
    }
    return true;
}

function teaCheckAllParamsTypes(reqBody, response) {
    if (!isString(reqBody.name)) {
        httpResponse.badRequestOnInvalidParamType(response, 'name', stringType);
        return false;
    } else if (!isString(reqBody.description)) {
        httpResponse.badRequestOnInvalidParamType(response, 'description', stringType);
        return false;
    } else if (!isString(reqBody.originCountry)) {
        httpResponse.badRequestOnInvalidParamType(response, 'originCountry', stringType);
        return false;
    } else if (!isString(reqBody.harvestSeason)) {
        httpResponse.badRequestOnInvalidParamType(response, 'harvestSeason', stringType);
        return false;
    } else if (!isNumber(reqBody.caffeineContent)) {
        httpResponse.badRequestOnInvalidParamType(response, 'caffeineContent', numberType);
        return false;
    }
    return true;
}

function isNumber(responseValue) {
    return typeof responseValue === numberType;
}

function isString(responseValue) {
    return typeof responseValue === stringType;
}

//----tea controllers ----
const stringIsAValidUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (error) {
        return false;
    }
};

function checkIsLinkOk(imageLink, response) {
    if (imageLink && !isString(imageLink) && !stringIsAValidUrl(imageLink)) {
        httpResponse.badRequestOnInvalidUrl(response, imageLink);
        return false;
    }
    return true;
}

function isValidTeaRequest(request, response) {
    return teaCheckAreRequiredParamsValid(request.body, response) &&
        teaCheckAllParamsTypes(request.body, response) &&
        checkIsLinkOk(request.body.imageLink, response);
}

app.post('/teatime/tea/add', (request, response) => {

    if (!isValidTeaRequest(request, response)) {
        return
    }

    const tea = {
        id: uuidv1(),
        name: request.body.name,
        originCountry: request.body.originCountry,
        harvestSeason: request.body.harvestSeason,
        caffeineContent: request.body.caffeineContent,
        description: request.body.description,
        imageLink: request.body.imageLink
    };
    teaStorage.push(tea);
    return httpResponse.successWithResponse(response, tea, 'tea added successfully');
});

app.get('/teatime/tea/get/:id', (request, response) => {
    teaStorage.map((teas) => {
        if (teas.id === request.params.id) {
            return httpResponse.successWithResponse(response, teas, 'tea retrieved successfully');
        }
    });
    return httpResponse.notFound(response, 'tea')
});

app.delete('/teatime/tea/delete/:id', (request, response) => {
    teaStorage.map((tea, index) => {
        if (tea.id === request.params.id) {
            teaStorage.splice(index, 1);
            return httpResponse.successWithoutResponse(response, 'tea deleted successfully');
        }
    });
    return httpResponse.notFound(response, 'tea')
});

app.put('/teatime/tea/update/:id', (request, response) => {
    let teaFound;
    let itemIndex;
    teaStorage.map((tea, index) => {
        if (tea.id === request.params.id) {
            teaFound = tea;
            itemIndex = index;
        }
    });

    if (!teaFound) {
        return httpResponse.notFound(response, 'tea');
    }

    if (!isValidTeaRequest(request, response)) {
        return
    }

    const updatedTea = {
        id: teaFound.id,
        name: request.body.name || teaFound.name,
        originCountry: request.body.originCountry || teaFound.originCountry,
        harvestSeason: request.body.harvestSeason || teaFound.harvestSeason,
        caffeineContent: request.body.caffeineContent || teaFound.caffeineContent,
        description: request.body.description || teaFound.description,
        imageLink: request.body.imageLink || teaFound.imageLink
    };

    teaStorage.splice(itemIndex, 1, updatedTea);

    return httpResponse.successWithResponse(response, updatedTea, 'tea updated successfully')
});
//----/tea controllers ----

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
