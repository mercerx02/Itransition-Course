const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const connectDB = require('./config/db')

connectDB()


const app = express()
const cors = require('cors')

app.use(cors())


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', require('./routes/messageRoutes'))


app.listen(port, ()=> console.log(`Server start on port ${port}`))
