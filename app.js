const express = require('express');
const app = express();
var cors = require('cors')

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors())

const routes = require('./routes/api')

app.use('/api', routes)

module.exports = app