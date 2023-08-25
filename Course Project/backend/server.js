const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const cookieSession = require('cookie-session')
const app = express()
const cors = require('cors')
const passportSetup = require('./OAuth/passport')
const authRoutes = require('./routes/auth')

const passport = require('passport')

app.use(cookieSession(
{
    name:"session",
    keys:['mercerx02'],
    maxAge: 100 * 24 * 60 * 60,
}))

app.use(cors({
    origin: "*",
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', authRoutes)

app.listen(port, () => console.log(`Server started on ${port}`))
