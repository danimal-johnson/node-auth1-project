const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require("express-session");

const KnexSessionStore = require("connect-session-knex")(session);
const dbConnection = require("../data/dbConfig.js");

const sessionConfig = {
  name: "peanutButter",  // Default = 'sid' - but that tells an attacker what we're using.
  // secret is used for cookie encryption
  secret: process.env.SESSION_SECRET || "seatec astronomy",
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false, // TODO: set to true in production
    httpOnly: true, // JS cannot access cookies in the browser
  },
  resave: false, // What is this?
  saveUninitialized: true,  // TODO: For GDPR compliance, set to false until user opts in
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    createtable: true,
    clearInterval: 60000,
  }),
};

module.exports = server => {
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(session(sessionConfig));
}