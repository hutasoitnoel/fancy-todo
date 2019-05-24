require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const routes = require('./routes/routes')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/todoApp', { useNewUrlParser: true, useCreateIndex: true })
mongoose.set('useFindAndModify', false);
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use('/', routes)

app.listen(port, () => {
    console.log(`~~~You are listening to ${port} FM~~`);
    console.log(`~~~Suara musik terkini~~~`);
}) 