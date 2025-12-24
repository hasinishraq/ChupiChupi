const app = require("./app");
const env = require("./config/env");
const pool = require("./config/db");

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    const server = app.listen(env.port, () => {
      console.log(`API listening on port ${env.port}`);
    });

    const shutdown = () => {
      server.close(() => {
        pool.end().then(() => process.exit(0));
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
