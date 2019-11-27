import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';

const uuidv1 = require('uuid/v1');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//----/tea controllers ----
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});