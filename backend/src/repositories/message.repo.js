const pool = require("../config/db");

const mapMessageRow = (row) => ({
  id: row.id,
  recipientId: row.recipient_id,
  content: row.content,
  senderIpHash: row.sender_ip_hash,
  userAgent: row.user_agent,
  isRead: Boolean(row.is_read),
  createdAt: row.created_at,
});

const createMessage = async ({ recipientId, content, senderIpHash, userAgent }) => {
  const [result] = await pool.execute(
    "INSERT INTO messages (recipient_id, content, sender_ip_hash, user_agent) VALUES (?, ?, ?, ?)",
    [recipientId, content, senderIpHash, userAgent]
  );

  return findById(result.insertId, recipientId);
};

const findById = async (id, recipientId) => {
  const [rows] = await pool.execute(
    "SELECT id, recipient_id, content, sender_ip_hash, user_agent, is_read, created_at FROM messages WHERE id = ? AND recipient_id = ? LIMIT 1",
    [id, recipientId]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapMessageRow(rows[0]);
};

const normalizePagination = (limit, offset) => {
  const parsedLimit = Number.parseInt(limit, 10);
  const parsedOffset = Number.parseInt(offset, 10);
  const safeLimit =
    Number.isInteger(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 20;
  const safeOffset = Number.isInteger(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

  return { safeLimit, safeOffset };
};

const listByRecipient = async ({ recipientId, limit, offset }) => {
  const { safeLimit, safeOffset } = normalizePagination(limit, offset);
  const [rows] = await pool.execute(
    `SELECT id, recipient_id, content, sender_ip_hash, user_agent, is_read, created_at FROM messages WHERE recipient_id = ? ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    [recipientId]
  );

  return rows.map(mapMessageRow);
};

const countByRecipient = async (recipientId) => {
  const [rows] = await pool.execute(
    "SELECT COUNT(*) AS total FROM messages WHERE recipient_id = ?",
    [recipientId]
  );

  return rows[0]?.total || 0;
};

const markRead = async (id, recipientId) => {
  const [result] = await pool.execute(
    "UPDATE messages SET is_read = 1 WHERE id = ? AND recipient_id = ?",
    [id, recipientId]
  );

  return result.affectedRows > 0;
};

const deleteMessage = async (id, recipientId) => {
  const [result] = await pool.execute(
    "DELETE FROM messages WHERE id = ? AND recipient_id = ?",
    [id, recipientId]
  );

  return result.affectedRows > 0;
};

module.exports = {
  createMessage,
  findById,
  listByRecipient,
  countByRecipient,
  markRead,
  deleteMessage,
};
