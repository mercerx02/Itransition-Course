const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStratedy = require('passport-github2').Strategy;
const passport = require('passport')
const dotenv = require('dotenv').config()
const User = require('../models/userModel')


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
},
async function(accessToken, refreshToken, profile, done) {
  try {
    const existingUser = await User.findOne({ provider_id: profile.id });

    if (existingUser) {
      done(null, existingUser);
    } else {
      const newUser = new User({
        provider_id: profile.id,
        name: profile.displayName,
        photo_url: profile.photos[0].value,
        is_admin: false
      });

      await newUser.save();
      console.log(newUser)
      done(null, newUser);
    }
  } catch (error) {
    done(error, null);
  }
}));


passport.use(new GitHubStratedy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`
},
function(accessToken, refreshToken, profile, done) {
  done(null, profile)
}
));


passport.serializeUser((user, done)=>{
    done(null, user)
})
passport.deserializeUser((user, done)=>{
    done(null, user)
})
