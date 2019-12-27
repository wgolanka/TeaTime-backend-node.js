import express from 'express';
import teaStorage from './db/teaStorage';
import usersStorage from './db/usersStorage';
import bodyParser from 'body-parser';
import {
    isAnyFieldWrongParamTypeTea,
    isAnyRequiredFieldMissingTea,
    isAuthorNotFound,
    isLinkOk
} from "./validation/teaValidation";
import {isAnyFieldWrongParamTypeUser, isAnyRequiredFieldMissingUser} from "./validation/userValidation";
import accessoriesStorage from "./db/accessoriesStorage";
import {
    isAnyFieldWrongParamTypeAccessory,
    isAnyRequiredFieldMissingAccessory,
    isBadPriceRange
} from "./validation/accessoryValidation";

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

    const {name, originCountry, harvestSeason, caffeineContent, description, imageLink, authorId} = request.body;

    const tea = {
        id: uuidv1(),
        name,
        originCountry,
        harvestSeason,
        caffeineContent,
        description,
        imageLink,
        authorId
    };

    teaStorage.push(tea);
    addTeaToAuthor(tea.id, tea.authorId);

    return httpResponse.successWithResponse(response, tea, 'tea added successfully');
});

function isValidTeaRequest(request, response) {
    return !isAuthorNotFound(request.body.authorId, response) &&
        !isAnyRequiredFieldMissingTea(request.body, response) &&
        !isAnyFieldWrongParamTypeTea(request.body, response) &&
        isLinkOk(request.body.imageLink, response);
}

function addTeaToAuthor(teaId, authorId) {
    usersStorage
        .find(user => user.id === authorId)
        .teas.push(teaId);
}

function findTea(id) {
    return teaStorage.find(tea => tea.id === id);
}

app.get('/teatime/tea/get/:id', (request, response) => {
    const storedTea = findTea(request.params.id);

    if (!storedTea) {
        return httpResponse.notFound(response, 'tea');
    }

    return httpResponse.successWithResponse(response, tea, 'tea retrieved successfully');
});

function findUser(id) {
    return usersStorage.find(user => user.id === id);
}

function removeTeaFromAuthor(teaId, authorId) {
    const storedUser = findUser(authorId);
    const teaIndex = storedUser.teas.indexOf(teaId);
    storedUser.teas.splice(teaIndex, 1);
}

app.delete('/teatime/tea/delete/:id', (request, response) => {
    const storedTea = findTea(request.params.id);

    if (!storedTea) {
        return httpResponse.notFound(response, 'tea');
    }

    deleteTea(storedTea);

    return httpResponse.successWithoutResponse(response, 'tea deleted successfully');
});

function deleteTea(storedTea) {
    const index = teaStorage.indexOf(storedTea);
    teaStorage.splice(index, 1);
    removeTeaFromAuthor(storedTea.id, storedTea.authorId);
}

app.put('/teatime/tea/update/:id', (request, response) => {
    const storedTea = findTea(request.params.id);

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
        imageLink: imageLink || storedTea.imageLink,
        authorId: storedTea.authorId
    };

    teaStorage.splice(teaStorage.indexOf(storedTea), 1, updatedTea);

    return httpResponse.successWithResponse(response, updatedTea, 'tea updated successfully')
});
//----/tea controllers ----


//----user controllers ----

app.get('/teatime/user/all', (request, response) => {
    return httpResponse.successWithResponse(response, usersStorage, 'users retrieved successfully');
});

app.get('/teatime/user/get/:id', (request, response) => {
    const storedUser = findUser(request.params.id);

    if (!storedUser) {
        return httpResponse.notFound(response, 'user');
    }

    return httpResponse.successWithResponse(response, storedUser, 'user retrieved successfully');
});

app.post('/teatime/user/add', (request, response) => {

    if (!isValidUserRequest(request, response)) {
        return
    }

    const {nick, email, description, imageLink} = request.body;

    const user = {
        id: uuidv1(),
        nick,
        email,
        accountCreated: Date.now(),
        description,
        imageLink,
        teas: []
    };

    usersStorage.push(user);

    return httpResponse.successWithResponse(response, user, 'user added successfully');
});

function isValidUserRequest(request, response) {
    return !isAnyRequiredFieldMissingUser(request.body, response) &&
        !isAnyFieldWrongParamTypeUser(request.body, response) &&
        isLinkOk(request.body.imageLink, response);
}

app.put('/teatime/user/update/:id', (request, response) => {
    const storedUser = findUser(request.params.id);

    if (!storedUser) {
        return httpResponse.notFound(response, 'user');
    }

    if (!isValidUserRequest(request, response)) {
        return
    }

    const {nick, email, description, imageLink} = request.body;

    const updatedUser = {
        id: storedUser.id,
        nick: nick,
        email: email,
        description: description,
        imageLink: imageLink || storedUser.imageLink,
        teas: storedUser.teas
    };

    usersStorage.splice(usersStorage.indexOf(storedUser), 1, updatedUser);

    return httpResponse.successWithResponse(response, updatedUser, 'user updated successfully')
});

app.delete('/teatime/user/delete/:id', (request, response) => {
    const storedUser = findUser(request.params.id);

    if (!storedUser) {
        return httpResponse.notFound(response, 'user');
    }

    const index = usersStorage.indexOf(storedUser);
    usersStorage.splice(index, 1);
    removeAllAuthorTeas(storedUser.id);

    return httpResponse.successWithoutResponse(response, 'user deleted successfully');
});

function removeAllAuthorTeas(authorId) {
    for (let i = teaStorage.length - 1; i >= 0; i--) {
        if (teaStorage[i].authorId === authorId) {
            teaStorage.splice(i, 1);
        }
    }
}

//----/user controllers ----


//----accessory controllers ----

app.get('/teatime/accessory/all', (request, response) => {
    return httpResponse.successWithResponse(response, accessoriesStorage, 'accessories retrieved successfully');
});

app.get('/teatime/accessory/:id', (request, response) => {
    const accessory = findAccessory(request.params.id);

    if (!accessory) {
        return httpResponse.notFound(response, 'accessory');
    }

    return httpResponse.successWithResponse(response, accessory, 'Accessory retrieved successfully');
});

function findAccessory(id) {
    return accessoriesStorage.find(accessory => accessory.id === id);
}

app.post('/teatime/accessory/add', (request, response) => {

    if (!isValidAccessoryRequest(request, response)) {
        return
    }

    const {name, isNecessary, description, priceFrom, priceTo, imageLink} = request.body;

    const accessory = {
        id: uuidv1(),
        name,
        isNecessary,
        description,
        accountCreated: Date.now(),
        priceFrom,
        priceTo,
        imageLink
    };

    accessoriesStorage.push(accessory);

    return httpResponse.successWithResponse(response, accessory, 'accessory added successfully');
});

function isValidAccessoryRequest(request, response) {
    return !isAnyRequiredFieldMissingAccessory(request.body, response) &&
        !isAnyFieldWrongParamTypeAccessory(request.body, response) &&
        isLinkOk(request.body.imageLink, response) &&
        !isBadPriceRange(response, request.body.priceFrom, request.body.priceTo);
}

//----/accessory controllers ----

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
