
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes/index');
const googleRoutes = require('./routes/google')
const connection = require('./config/database');


const MongoStore = require('connect-mongo')(session);

require('./config/passport');

require('dotenv').config();


const app = express();

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

const sessionStore = new MongoStore({mongooseConnection:connection,collection:'sessions'})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24
    }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.use(googleRoutes);

const port = 5002;

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}....`)
})
