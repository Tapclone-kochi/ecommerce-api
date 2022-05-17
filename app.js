const express = require('express');
const app = express();
var cors = require('cors')
var morgan = require('morgan')
const mongoose = require('mongoose');
require('dotenv').config()

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors())
app.use(morgan('combined'));

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    keepAlive: true,
  })
  .then(() => console.log('Database Connected Successfully'))
  .catch((error) => console.log('ERROR : Database Connection Failed', error));

const routes = require('./routes/api')

app.use('/api', routes)

module.exports = app