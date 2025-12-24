const express = require("express");
const messageController = require("../controllers/message.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { messageLimiter } = require("../middlewares/rateLimit.middleware");
const { createMessageSchema, paginationSchema, shareTokenSchema } = require("../validators/message.schema");

const router = express.Router();

router.get(
  "/:shareToken",
  validate(shareTokenSchema, "params"),
  messageController.getRecipient
);
router.post(
  "/:shareToken",
  messageLimiter,
  validate(shareTokenSchema, "params"),
  validate(createMessageSchema),
  messageController.createMessage
);

router.get("/", auth, validate(paginationSchema, "query"), messageController.listMessages);
router.patch("/:id/read", auth, messageController.markRead);
router.delete("/:id", auth, messageController.deleteMessage);

module.exports = router;
