const router = require('express').Router()
const passport = require('passport')
const dotenv = require('dotenv').config()


router.get("/google", passport.authenticate("google", {scope:["profile"]}))

router.get("/login/failed", (req, res)=>{
    res.status(401).json({
        succes: false,
        message: "failure"
    })
})

router.get("/user/me", (req, res)=>{
    if(req.user){
    res.status(200).json({
        succes: true,
        message: "succesful",
        user: req.user,
    })
    }
})

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
