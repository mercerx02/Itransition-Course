const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStratedy = require('passport-github2').Strategy;
const passport = require('passport')
const dotenv = require('dotenv').config()


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://itranstition-course-project.onrender.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    done(null, profile)
  }
));


passport.use(new GitHubStratedy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "https://itranstition-course-project.onrender.com/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log(profile)
  done(null, profile)
}
));


passport.serializeUser((user, done)=>{
    done(null, user)
})
passport.deserializeUser((user, done)=>{
    done(null, user)
})
