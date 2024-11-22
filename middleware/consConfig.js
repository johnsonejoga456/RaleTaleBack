const cors = require("cors");

const corsConfig = cors({
  origin: [
    process.env.LOCAL_CLIENT_APP,
    process.env.REMOTE_CLIENT_APP,
    process.env.LOCAL_AMDMIN_APP,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

module.exports = corsConfig;
