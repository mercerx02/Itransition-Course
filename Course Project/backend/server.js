const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()
const cors = require('cors')
const passportSetup = require('./OAuth/passport')
const authRoutes = require('./routes/auth')
const reviewRoutes = require('./routes/reviewRoute')
const tagRoutes = require('./routes/tagRoute')
const userRoutes = require('./routes/userRoute')
const pieceRoutes = require('./routes/pieceRoute')
const session = require('express-session')
const connectDB = require('./config/db')

const passport = require('passport')

connectDB()

app.set('trust proxy', 1);

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true , sameSite:'none', maxAge: 100 * 24 * 60 * 60 }
  }))


app.use(cors({
    origin: ["https://merry-cascaron-4c67b3.netlify.app","http://localhost:5173"],
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,

}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', authRoutes)
app.use('/api', reviewRoutes)
app.use('/api', tagRoutes)
app.use('/api', userRoutes)
app.use('/api', pieceRoutes)



app.listen(port, () => console.log(`Server started on ${port}`))
