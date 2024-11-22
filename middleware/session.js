// middleware/session.js
const session = require("express-session");

const sessionOptions = session({
  key: "userIProps",
  secret: "subscribe",
  resave: false,
  saveUninitialized: false,
  cookie: { expires: 24 * 60 * 60 * 1000 },
});

module.exports = sessionOptions;
