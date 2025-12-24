const env = require("../config/env");

const notFound = (req, res) => {
  res.status(404).json({ error: { message: "Route not found" } });
};

const errorHandler = (err, req, res, next) => {
  const status = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const response = {
    error: {
      message: err.message || "Internal Server Error",
    },
  };

  if (env.nodeEnv !== "production") {
    response.error.stack = err.stack;
  }

  res.status(status).json(response);
};

module.exports = { notFound, errorHandler };
