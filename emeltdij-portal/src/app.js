const express = require('express');
const session = require('express-session');

const { apiV1Router } = require('./api/v1');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    },
  })
);

// Modellek és relációk betöltése (side-effect)
require('./models');

// Root: egyszerű szöveges válasz
app.get('/', (req, res) => {
  res.type('text/plain; charset=utf-8');
  res.send('EDT digit – Emeltdíjas Portál backend működik 🚀');
});

// API v1
app.use('/api/v1', apiV1Router);

// 404 + error contract
app.use(notFound);
app.use(errorHandler);

module.exports = app;
