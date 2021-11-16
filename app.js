const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json())

const routes = require('./routes/api')

app.use('/api', routes)

module.exports = app