const router = require('express').Router()
const passport = require('passport')
const dotenv = require('dotenv').config()
const User = require('../models/userModel')

router.get("/google", passport.authenticate("google", {scope:["profile"]}))

router.get("/login/failed", (req, res)=>{
    res.status(401).json({
        succes: false,
        message: "failure"
    })
})

router.get("/user/me", async (req, res) => {
    if (req.user) {
      const user = await User.findById(req.user._id)

      res.status(200).json({
        success: true,
        message: "successful",
        user: user,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
    }
  });

router.get("/logout", (req, res) => {
    req.logout()
    res.redirect(process.env.CLIENT_URL)
})

router.get("/google/callback",passport.authenticate("google",{
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "login/failed"
}))


router.get("/github", passport.authenticate("github", {scope:["profile"]}))


router.get("/github/callback",passport.authenticate("github",{
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "login/failed"
}))


module.exports = router;
