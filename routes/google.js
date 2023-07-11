const googleRouter = require('express').Router();
const passport = require('passport');
// const connection = require('../config/database');
// const User = connection.models.User;
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
  clientID: "659824515641-e9rrrkp3o5jojh11im9q2u4erg4qq56f.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: '/auth/google/dashboard'
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  return done(null, profile);
}));

googleRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

googleRouter.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/auth/google/dashboard',
  failureRedirect: '/error'
}));

googleRouter.get('/auth/google/dashboard', (req, res) => {
  const filePath = path.join(__dirname, '../public/dashboard/dashindex.html');
  res.sendFile(filePath);
});

googleRouter.get('/error',(req,res)=>{
  const filePath = path.join(__dirname, '../public/dashboard/404.html');
  res.sendFile(filePath);
})

module.exports = googleRouter;