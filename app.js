const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.urlencoded({ extended: false }));


const port = 5002;

app.use(express.static('public'));

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}....`)
})
