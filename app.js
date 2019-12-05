import express from 'express';
import teaStorage from './db/teaStorage';
import bodyParser from 'body-parser';
import {isAnyFieldWrongParamType, isAnyRequiredFieldMissing, isLinkOk} from "./validation/teaValidation";

const uuidv1 = require('uuid/v1');
const app = express();

const httpResponse = require('./response/response');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/teatime/tea/all', (request, response) => {
    return httpResponse.successWithResponse(response, teaStorage, 'teas retrieved successfully');
});

//----tea controllers ----

function isValidTeaRequest(request, response) {
    return !isAnyRequiredFieldMissing(request.body, response) &&
        !isAnyFieldWrongParamType(request.body, response) &&
        isLinkOk(request.body.imageLink, response);
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
