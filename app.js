const express = require('express')
const api = require('./api')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use('/', api)
module.exports = app
