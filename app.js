require("./config/env"); // Load environment variables
const express = require("express");
const corsConfig = require("./middlewear/consConfig");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const agentRoutes = require("./routes/agentRoutes");

const app = express();

app.use(express.json());
app.use(corsConfig);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    key: "userIProps",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 24 * 60 * 60 * 1000 },
  })
);

app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/agents", agentRoutes);

module.exports = app;
