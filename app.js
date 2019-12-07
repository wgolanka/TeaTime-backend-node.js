import express from 'express';
import teaStorage from './db/teaStorage';
import usersStorage from './db/usersStorage';
import bodyParser from 'body-parser';
import {isAnyFieldWrongParamTypeTea, isAnyRequiredFieldMissingTea, isLinkOk} from "./validation/teaValidation";
import {isAnyFieldWrongParamTypeUser, isAnyRequiredFieldMissingUser} from "./validation/userValidation";

const uuidv1 = require('uuid/v1');
const app = express();

const httpResponse = require('./response/response');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//----tea controllers ----


app.get('/teatime/tea/all', (request, response) => {
    return httpResponse.successWithResponse(response, teaStorage, 'teas retrieved successfully');
});

app.post('/teatime/tea/add', (request, response) => {

    if (!isValidTeaRequest(request, response)) {
        return
    }

    const {name, originCountry, harvestSeason, caffeineContent, description, imageLink} = request.body;

    const tea = {
        id: uuidv1(),
        name,
        originCountry,
        harvestSeason,
        caffeineContent,
        description,
        imageLink
    };

    teaStorage.push(tea);

    return httpResponse.successWithResponse(response, tea, 'tea added successfully');
});

function isValidTeaRequest(request, response) {
    return !isAnyRequiredFieldMissingTea(request.body, response) &&
        !isAnyFieldWrongParamTypeTea(request.body, response) &&
        isLinkOk(request.body.imageLink, response);
}

app.get('/teatime/tea/get/:id', (request, response) => {
    teaStorage.map((tea) => {
        if (tea.id === request.params.id) {
            return httpResponse.successWithResponse(response, tea, 'tea retrieved successfully');
        }
    });

    return httpResponse.notFound(response, 'tea');
});

app.delete('/teatime/tea/delete/:id', (request, response) => {
    teaStorage.map((tea, index) => {
        if (tea.id === request.params.id) {
            teaStorage.splice(index, 1);
            return httpResponse.successWithoutResponse(response, 'tea deleted successfully');
        }
    });

    return httpResponse.notFound(response, 'tea');
});

app.put('/teatime/tea/update/:id', (request, response) => {
    const storedTea = teaStorage.find(tea => tea.id === request.params.id);

    if (!storedTea) {
        return httpResponse.notFound(response, 'tea');
    }

    if (!isValidTeaRequest(request, response)) {
        return
    }

    const {name, originCountry, harvestSeason, caffeineContent, description, imageLink} = request.body;

    const updatedTea = {
        id: storedTea.id,
        name: name,
        originCountry: originCountry,
        harvestSeason: harvestSeason,
        caffeineContent: caffeineContent,
        description: description,
        imageLink: imageLink || storedTea.imageLink
    };

    teaStorage.splice(teaStorage.indexOf(storedTea), 1, updatedTea);

    return httpResponse.successWithResponse(response, updatedTea, 'tea updated successfully')
});
//----/tea controllers ----


//----user controllers ----

app.get('/teatime/user/all', (request, response) => {
    return httpResponse.successWithResponse(response, usersStorage, 'users retrieved successfully');
});

app.post('/teatime/user/add', (request, response) => {

    if (!isValidAddUserRequest(request, response)) {
        return
    }

    const {nick, email, description, imageLink} = request.body;

    const user = {
        id: uuidv1(),
        nick,
        email,
        accountCreated: Date.now(),
        description,
        imageLink
    };

    usersStorage.push(user);

    return httpResponse.successWithResponse(response, user, 'user added successfully');
});

function isValidAddUserRequest(request, response) {
    return !isAnyRequiredFieldMissingUser(request.body, response) &&
        !isAnyFieldWrongParamTypeUser(request.body, response) &&
        isLinkOk(request.body.imageLink, response);
}


//----/user controllers ----

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
