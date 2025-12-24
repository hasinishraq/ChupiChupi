const crypto = require("crypto");
const env = require("../config/env");
const AppError = require("../utils/appError");
const messageRepo = require("../repositories/message.repo");
const userRepo = require("../repositories/user.repo");

const hashSenderIp = (ip) => {
  if (!ip) {
    return null;
  }

  return crypto.createHash("sha256").update(`${env.jwt.secret}:${ip}`).digest("hex");
};

const sanitizeMessage = (message) => ({
  id: message.id,
  content: message.content,
  isRead: message.isRead,
  createdAt: message.createdAt,
});

const normalizePagination = ({ page, limit }) => {
  const parsedPage = Number.parseInt(page, 10);
  const parsedLimit = Number.parseInt(limit, 10);
  const safePage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const safeLimit =
    Number.isInteger(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 20;

  return { page: safePage, limit: safeLimit };
};

const sendMessage = async ({ shareToken, content, ip, userAgent }) => {
  const recipient = await userRepo.findByShareToken(shareToken);
  if (!recipient) {
    throw new AppError("Recipient not found", 404);
  }

  const senderIpHash = hashSenderIp(ip);
  const message = await messageRepo.createMessage({
    recipientId: recipient.id,
    content,
    senderIpHash,
    userAgent,
  });

  return sanitizeMessage(message);
};

const listMessages = async ({ userId, page, limit }) => {
  const { page: safePage, limit: safeLimit } = normalizePagination({ page, limit });
  const offset = (safePage - 1) * safeLimit;
  const [items, total] = await Promise.all([
    messageRepo.listByRecipient({ recipientId: userId, limit: safeLimit, offset }),
    messageRepo.countByRecipient(userId),
  ]);

  return {
    items: items.map(sanitizeMessage),
    page: safePage,
    limit: safeLimit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / safeLimit),
  };
};

const markRead = async ({ userId, messageId }) => {
  const updated = await messageRepo.markRead(messageId, userId);
  if (!updated) {
    throw new AppError("Message not found", 404);
  }

  return { success: true };
};

const deleteMessage = async ({ userId, messageId }) => {
  const deleted = await messageRepo.deleteMessage(messageId, userId);
  if (!deleted) {
    throw new AppError("Message not found", 404);
  }

  return { success: true };
};

const getRecipientByShareToken = async (shareToken) => {
  const recipient = await userRepo.findByShareToken(shareToken);
  if (!recipient) {
    throw new AppError("Recipient not found", 404);
  }

  return { username: recipient.username };
};

module.exports = {
  sendMessage,
  listMessages,
  markRead,
  deleteMessage,
  getRecipientByShareToken,
};
