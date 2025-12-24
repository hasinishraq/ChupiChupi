const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.set("trust proxy", 1);

const corsOrigins = env.corsOrigin
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
const hasWildcardOrigin = corsOrigins.includes("*");
const corsOptions = {
  origin: hasWildcardOrigin ? "*" : corsOrigins,
  credentials: !hasWildcardOrigin,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

if (env.nodeEnv !== "test") {
  app.use(morgan("combined"));
}

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
