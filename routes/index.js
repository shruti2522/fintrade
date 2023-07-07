const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const path = require('path');


/**
 * -------------- POST ROUTES ----------------
 */

router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }));

router.post('/register', (req, res, next) => {
const saltHash = genPassword(req.body.password);

const salt = saltHash.salt;
const hash = saltHash.hash;

const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
    admin: true
});

newUser.save()
    .then((user) => {
        console.log(user);
    });

res.redirect('/login');
});


 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    const filePath = path.join(__dirname,'../public/index.html')
    res.sendFile(filePath);
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
    const filePath = path.join(__dirname,'../public/dashboard/login.html');
    res.sendFile(filePath);
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {
    const filePath = path.join(__dirname,'../public/dashboard/register.html');
    res.sendFile(filePath);
});

router.get('/forgot', (req, res, next) => {
    const filePath = path.join(__dirname,'../public/dashboard/forgot-password.html');
    res.sendFile(filePath);
});
/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/dashboard', (req, res, next) => {
    
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        const filePath = path.join(__dirname,'../public/dashboard/index.html');
        res.sendFile(filePath);
    } else {
        const filePath = path.join(__dirname,'../public/dashboard/register.html');
        res.sendFile(filePath);
    }
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/dashboard');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/dashboard">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;