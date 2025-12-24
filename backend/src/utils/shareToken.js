const crypto = require("crypto");

const createShareToken = () => crypto.randomBytes(16).toString("hex");

module.exports = { createShareToken };
