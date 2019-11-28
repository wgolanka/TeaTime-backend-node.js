import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';

const uuidv1 = require('uuid/v1');
const app = express();
const URL = require("url").URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//TODO add readme how to start a project

app.get('/teatime/tea/all', (request, response) => {
    return sendSuccessWithResponse(response, db, 'teas retrieved successfully');
});

function checkAreRequiredParamsValid(reqBody, response) {
    if (!reqBody.name) {
        sendBadRequestOnMissingParam(response, 'name');
        return false;
    } else if (!reqBody.description) {
        sendBadRequestOnMissingParam(response, 'description');
        return false;
    } else if (!reqBody.originCountry) {
        sendBadRequestOnMissingParam(response, 'originCountry');
        return false;
    } else if (!reqBody.harvestSeason) {
        sendBadRequestOnMissingParam(response, 'harvestSeason');
        return false;
    } else if (!reqBody.caffeineContent) {
        sendBadRequestOnMissingParam(response, 'caffeineContent');
        return false;
    }
    return true;
}

//----tea controllers ----

function sendBadRequestOnMissingParam(response, paramName) {
    return response.status(400).send({
        success: 'false',
        message: paramName + ' is required'
    });
}

const stringIsAValidUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};


function sendBadRequestOnInvalidUrl(response, link) {
    return response.status(400).send({
        success: 'false',
        message: link + ' is not a valid url'
    });
}

function checkIsLinkOk(imageLink, response) {
    if (imageLink && !stringIsAValidUrl(imageLink)) {
        sendBadRequestOnInvalidUrl(response, imageLink);
        return false;
    }
    return true;
}

function isValidRequest(request, response) {
    return checkAreRequiredParamsValid(request.body, response) &&
        checkIsLinkOk(request.body.imageLink, response);
}

app.post('/teatime/tea/add', (request, response) => {

    if (!isValidRequest()) {
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
    db.push(tea);
    return sendSuccessWithResponse(response, tea, 'tea added successfully');
});

function sendSuccessWithResponse(response, teas, message) {
    return response.status(200).send({
        success: 'true',
        message: message,
        teas,
    });
}

app.get('/teatime/tea/get/:id', (request, response) => {
    db.map((teas) => {
        if (teas.id === request.params.id) {
            return sendSuccessWithResponse(response, teas, 'teas retried successfully');
        }
    });
    return sendNotFound(response, 'tea')
});

function sendSuccessWithoutResponse(response, message) {
    return response.status(200).send({
        success: 'true',
        message: message,
    });
}

app.delete('/teatime/tea/delete/:id', (request, response) => {
    db.map((tea, index) => {
        if (tea.id === request.params.id) {
            db.splice(index, 1);
            return sendSuccessWithoutResponse(response, 'tea deleted successfully');
        }
    });
    return sendNotFound(response, 'tea')
});

function sendNotFound(response, name) {
    return response.status(404).send({
        success: 'false',
        message: name + ' not found',
    });
}

app.put('/teatime/tea/update/:id', (request, response) => {
    let teaFound;
    let itemIndex;
    db.map((tea, index) => {
        if (tea.id === request.params.id) {
            teaFound = tea;
            itemIndex = index;
        }
    });

    if (!teaFound) {
        return sendNotFound(response, 'tea');
    }

    if (!isValidRequest()) {
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

    db.splice(itemIndex, 1, updatedTodo);

    return sendSuccessWithResponse(response, updatedTodo, 'tea updated successfully')
});


//----/tea controllers ----
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});