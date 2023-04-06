const express = require('express');
const app = express();
var cors = require('cors')
var morgan = require('morgan')

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors())
app.use(morgan('combined'));

const routes = require('./routes/api')

app.use('/api', routes)

module.exports = app