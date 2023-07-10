const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const path = require('path');


/**
 * -------------- POST ROUTES ----------------
 */



router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));
  

// Middleware function to set the username

router.post('/register', (req, res, next) => {

const saltHash = genPassword(req.body.password);

const salt = saltHash.salt;
const hash = saltHash.hash;

const newUser = new User({
    username: req.body.username,
    name: req.body.name,
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

router.get('/login', (req, res, next) => {
    const filePath = path.join(__dirname,'../public/dashboard/login.html');
    res.sendFile(filePath);
});

router.get('/register', (req, res, next) => {
    const filePath = path.join(__dirname,'../public/dashboard/register.html');
    res.sendFile(filePath);
});

router.get('/forgot', (req, res, next) => {
    const filePath = path.join(__dirname,'../public/dashboard/password.html');
    res.sendFile(filePath);
});



router.get('/username', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ username: req.user.username});
    } else {
      res.json({ username: ''}); // If user is not authenticated, send an empty username
    }
  });

router.get('/name', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ name: req.user.name});
    } else {
        res.json({ name: ''}); // If user is not authenticated, send an empty username
    }
});
  
// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login');
});

router.get('/dashboard', (req, res, next) => {
    console.log('Dashboard route handler executed');
    if (req.isAuthenticated()) {
        const filePath = path.join(__dirname, '../public/dashboard/dashindex.html');
        res.sendFile(filePath);
    } else {
        const filePath = path.join(__dirname, '../public/dashboard/register.html');
        res.sendFile(filePath);
    }
});


router.get('/login-success', (req, res, next) => {
    const filePath = path.join(__dirname,'../public/dashboard/protected.html');
    res.sendFile(filePath);
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;