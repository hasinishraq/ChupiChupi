const pool = require("../config/db");

const mapUserRow = (row) => ({
  id: row.id,
  username: row.username,
  email: row.email,
  shareToken: row.share_token,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapAuthUserRow = (row) => ({
  ...mapUserRow(row),
  passwordHash: row.password_hash,
});

const findById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT id, username, email, share_token, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapUserRow(rows[0]);
};

const findByUsername = async (username) => {
  const [rows] = await pool.execute(
    "SELECT id, username, email, share_token, created_at, updated_at FROM users WHERE username = ? LIMIT 1",
    [username]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapUserRow(rows[0]);
};

const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT id, username, email, share_token, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapUserRow(rows[0]);
};

const findAuthByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT id, username, email, password_hash, share_token, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapAuthUserRow(rows[0]);
};

const findByShareToken = async (shareToken) => {
  const [rows] = await pool.execute(
    "SELECT id, username, email, share_token, created_at, updated_at FROM users WHERE share_token = ? LIMIT 1",
    [shareToken]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapUserRow(rows[0]);
};

const createUser = async ({ username, email, passwordHash, shareToken }) => {
  const [result] = await pool.execute(
    "INSERT INTO users (username, email, password_hash, share_token) VALUES (?, ?, ?, ?)",
    [username, email, passwordHash, shareToken]
  );

  return findById(result.insertId);
};

const updateShareToken = async (id, shareToken) => {
  await pool.execute("UPDATE users SET share_token = ? WHERE id = ?", [shareToken, id]);
  return findById(id);
};

module.exports = {
  findById,
  findByUsername,
  findByEmail,
  findAuthByEmail,
  findByShareToken,
  createUser,
  updateShareToken,
};
