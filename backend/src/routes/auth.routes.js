const express = require("express");
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { authLimiter } = require("../middlewares/rateLimit.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.schema");

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.get("/me", auth, authController.getProfile);
router.post("/share-token", auth, authController.regenerateShareToken);

module.exports = router;
