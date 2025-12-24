const asyncHandler = require("../utils/asyncHandler");
const messageService = require("../services/message.service");

const createMessage = asyncHandler(async (req, res) => {
  const message = await messageService.sendMessage({
    shareToken: req.params.shareToken,
    content: req.body.content,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  res.status(201).json({ data: message });
});

const listMessages = asyncHandler(async (req, res) => {
  const result = await messageService.listMessages({
    userId: req.user.id,
    page: req.query.page,
    limit: req.query.limit,
  });

  res.status(200).json(result);
});

const markRead = asyncHandler(async (req, res) => {
  const result = await messageService.markRead({
    userId: req.user.id,
    messageId: req.params.id,
  });

  res.status(200).json(result);
});

const deleteMessage = asyncHandler(async (req, res) => {
  const result = await messageService.deleteMessage({
    userId: req.user.id,
    messageId: req.params.id,
  });

  res.status(200).json(result);
});

const getRecipient = asyncHandler(async (req, res) => {
  const result = await messageService.getRecipientByShareToken(req.params.shareToken);
  res.status(200).json(result);
});

module.exports = {
  createMessage,
  listMessages,
  markRead,
  deleteMessage,
  getRecipient,
};
