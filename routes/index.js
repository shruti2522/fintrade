const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const path = require('path');


/**
 * -------------- POST ROUTES ----------------
 */



router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }), (req, res) => {
    res.render('login', { username: req.body.username }); // Pass the username to the login view
  });
  

// Middleware function to set the username

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

function sendJsonResponse(username, password) {
    // Construct the JSON response
    const jsonResponse = {
        username: username,
        password: password
    };
  
    // Send the JSON response to another route
    router.post('/user-info', (req, res) => {
        res.json(jsonResponse);
    });
}








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

router.get('/username', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ username: req.user.username });
    } else {
      res.json({ username: '' }); // If user is not authenticated, send an empty username
    }
  });
  
// router.get('/user', (req, res, next) => {
//     if (req.isAuthenticated()) {
//       const userInfo = {
//         username: req.user.username,
//         password: req.user.password
//       };
  
//       res.json(userInfo);
//     } else {
//       res.status(401).json({ message: 'User not authenticated' });
//     }
//   });

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/dashboard');
});

router.get('/login-success', (req, res, next) => {
    const filePath = path.join(__dirname,'../public/dashboard/protected.html');
    res.sendFile(filePath);
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;