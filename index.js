const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');

require('dotenv').config()

const port = process.env.PORT || 3000;

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,  
    useUnifiedTopology: true,
    autoIndex: true,
    keepAlive: true,
  })   
  .then(() => console.log('Database Connected Successfully'))
  .catch((error) => console.log('ERROR : Database Connection Failed', error));

server.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});