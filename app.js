import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';

const uuidv1 = require('uuid/v1');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//TODO add readme how to start a project

app.get('/teatime/tea/all', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'teas retrieved successfully',
        teas: db
    })
});

function checkRequiredParams(reqBody, response) {
    if (!reqBody.name) { //TODO add more validation
        sendBadRequestOnMissingParam(response, 'name');
        return false;
    } else if (!reqBody.description) {
        sendBadRequestOnMissingParam(response, 'description');
        return false;
    }
    return true;
}

//----tea controllers ----

function sendBadRequestOnMissingParam(res, paramName) {
    return res.status(400).send({
        success: 'false',
        message: paramName + ' is required'
    });
}

app.post('/teatime/tea/add', (req, res) => {
    if(!checkRequiredParams(req.body, res)){
        return;
    }
    const tea = {
        id: uuidv1(),
        name: req.body.name,
        originCountry: req.body.originCountry,
        harvestSeason: req.body.harvestSeason,
        caffeineContent: req.body.caffeineContent,
        description: req.body.description,
        imageLink: req.body.imageLink
    };
    db.push(tea);
    return sendSuccessWithResponse(res, tea, 'tea added successfully');
});

function sendSuccessWithResponse(res, teas, message) {
    return res.status(200).send({
        success: 'true',
        message: message,
        teas,
    });
}

app.get('/teatime/tea/get/:id', (req, res) => {
    db.map((teas) => {
        if (teas.id === req.params.id) {
            return sendSuccessWithResponse(res, teas, 'teas retried successfully');
        }
    });
    return sendNotFound(res, 'tea')
});

app.delete('/teatime/tea/delete/:id', (req, res) => {
    db.map((tea, index) => {
        if (tea.id === req.params.id) {
            db.splice(index, 1);
            return res.status(200).send({
                success: 'true',
                message: 'tea deleted successfully',
            });
        }
    });
    return sendNotFound(res, 'tea')
});

function sendNotFound(res, name) {
    return res.status(404).send({
        success: 'false',
        message: name + ' not found',
    });
}

app.put('/teatime/tea/update/:id', (req, res) => {
    let teaFound;
    let itemIndex;
    db.map((tea, index) => {
        if (tea.id === req.params.id) {
            teaFound = tea;
            itemIndex = index;
        }
    });

    if (!teaFound) {
        return sendNotFound(res, 'tea');
    }

    if (!req.body.name) { //add more validation
        return res.status(400).send({
            success: 'false',
            message: 'name is required',
        });
    } else if (!req.body.description) {
        return res.status(400).send({
            success: 'false',
            message: 'description is required',
        });
    }

    const updatedTodo = {
        id: teaFound.id,
        name: req.body.name || teaFound.name,
        originCountry: req.body.originCountry || teaFound.originCountry,
        harvestSeason: req.body.harvestSeason || teaFound.harvestSeason,
        caffeineContent: req.body.caffeineContent || teaFound.caffeineContent,
        description: req.body.description || teaFound.description,
        imageLink: req.body.imageLink || teaFound.imageLink
    };

    db.splice(itemIndex, 1, updatedTodo);

    return sendSuccessWithResponse(res, updatedTodo, 'tea updated successfully')
});


//----/tea controllers ----
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});