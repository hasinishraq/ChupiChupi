const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.set("trust proxy", 1);

const corsOrigins = env.corsOrigin.split(",").map((origin) => origin.trim());
const corsOptions = corsOrigins.includes("*")
  ? { origin: "*" }
  : { origin: corsOrigins, credentials: true };

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

if (env.nodeEnv !== "test") {
  app.use(morgan("combined"));
}

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
