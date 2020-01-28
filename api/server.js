const express = require('express');

const apiRouter = require('./api-router.js');
const configureMiddleWare = require('./configure-middleware.js');

const server = express();
configureMiddleWare(server);
server.use('/api', apiRouter);

server.get('/', (req, res) => {
  res.status(200).json({ message: "Login server is running."});
})

module.exports = server;