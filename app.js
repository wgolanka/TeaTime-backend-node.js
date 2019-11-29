import express from 'express';
import teaStorage from './db/teaStorage';
import bodyParser from 'body-parser';

const uuidv1 = require('uuid/v1');
const app = express();
const URL = require("url").URL;
const statusResponse = require('./response/response');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//TODO add readme how to start a project

app.get('/teatime/tea/all', (request, response) => {
    return statusResponse.successWithResponse(response, teaStorage, 'teas retrieved successfully');
});

function teaCheckAreRequiredParamsValid(reqBody, response) {
    if (!reqBody.name) {
        statusResponse.badRequestOnMissingParam(response, 'name');
        return false;
    } else if (!reqBody.description) {
        statusResponse.badRequestOnMissingParam(response, 'description');
        return false;
    } else if (!reqBody.originCountry) {
        statusResponse.badRequestOnMissingParam(response, 'originCountry');
        return false;
    } else if (!reqBody.harvestSeason) {
        statusResponse.badRequestOnMissingParam(response, 'harvestSeason');
        return false;
    } else if (!reqBody.caffeineContent) {
        statusResponse.badRequestOnMissingParam(response, 'caffeineContent');
        return false;
    }
    return true;
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
    if (imageLink && !stringIsAValidUrl(imageLink)) {
        statusResponse.badRequestOnInvalidUrl(response, imageLink);
        return false;
    }
    return true;
}

function isValidTeaRequest(request, response) {
    return teaCheckAreRequiredParamsValid(request.body, response) &&
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
    return statusResponse.successWithResponse(response, tea, 'tea added successfully');
});

app.get('/teatime/tea/get/:id', (request, response) => {
    teaStorage.map((teas) => {
        if (teas.id === request.params.id) {
            return statusResponse.successWithResponse(response, teas, 'tea retrieved successfully');
        }
    });
    return statusResponse.notFound(response, 'tea')
});

app.delete('/teatime/tea/delete/:id', (request, response) => {
    teaStorage.map((tea, index) => {
        if (tea.id === request.params.id) {
            teaStorage.splice(index, 1);
            return statusResponse.successWithoutResponse(response, 'tea deleted successfully');
        }
    });
    return statusResponse.notFound(response, 'tea')
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
        return statusResponse.notFound(response, 'tea');
    }

    if (!isValidTeaRequest(request, response)) {
        return
    }

    const updatedTodo = {
        id: teaFound.id,
        name: request.body.name || teaFound.name,
        originCountry: request.body.originCountry || teaFound.originCountry,
        harvestSeason: request.body.harvestSeason || teaFound.harvestSeason,
        caffeineContent: request.body.caffeineContent || teaFound.caffeineContent,
        description: request.body.description || teaFound.description,
        imageLink: request.body.imageLink || teaFound.imageLink
    };

    teaStorage.splice(itemIndex, 1, updatedTodo);

    return statusResponse.successWithResponse(response, updatedTodo, 'tea updated successfully')
});


//----/tea controllers ----
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});