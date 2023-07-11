require('dotenv').config();
const googleRouter = require('express').Router();
const passport = require('passport');
// const connection = require('../config/database');
// const User = connection.models.User;
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/userprofile'
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  return done(null, profile);
}));

googleRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

googleRouter.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/auth/google/userprofile',
  failureRedirect: '/error'
}));

googleRouter.get('/auth/google/userprofile', (req, res) => {
  const filePath = path.join(__dirname, '../public/dashboard/protected.html');
  res.sendFile(filePath);
});

googleRouter.get('/error',(req,res)=>{
  const filePath = path.join(__dirname, '../public/dashboard/404.html');
  res.sendFile(filePath);
})

module.exports = googleRouter;