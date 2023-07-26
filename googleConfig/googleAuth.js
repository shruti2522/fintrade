require('dotenv').config();

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const googleRouter = require('express').Router();
const path = require('path');



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String
});

const GoogleUser = mongoose.model('GoogleUser', UserSchema);


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5002/auth/google/callback'

}, async (accessToken, refreshToken, profile, done) => {

  console.log(profile)
  const existingUser = await GoogleUser.findOne({ googleId: profile.id });
  if (existingUser) {
    return done(null, existingUser);
  }

  const newUser = new GoogleUser({
    googleId: profile.id,
    displayName: profile.displayName,
    email: profile.emails[0].value
  });

  await newUser.save().then((user) => {
      console.log(user);
  });
  done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);e
});

passport.deserializeUser((id, done) => {
  GoogleUser.findById(id, (err, user) => {
    done(err, user);
  });
});

googleRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

googleRouter.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/auth/google/success',
  failureRedirect: '/auth/google/failure'
}));

googleRouter.get('/auth/google/success', (req, res) => {
  const filePath = path.join(__dirname, '../public/dashboard/protected.html');
  res.sendFile(filePath);
});

googleRouter.get('/auth/google/failure',(req,res)=>{
  const filePath = path.join(__dirname, '../public/dashboard/404.html');
  res.sendFile(filePath);
})

googleRouter.get('/displayUser',(req,res)=>{
  GoogleUser.findOne(id,(err,user)=>{
    res.send(user);
    if (err) {
      res.send('Not found')
    }
  })
})

module.exports = googleRouter;