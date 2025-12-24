const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
});

const getProfile = asyncHandler(async (req, res) => {
  const result = await authService.getProfile(req.user.id);
  res.status(200).json(result);
});

const regenerateShareToken = asyncHandler(async (req, res) => {
  const result = await authService.regenerateShareToken(req.user.id);
  res.status(200).json(result);
});

module.exports = {
  register,
  login,
  getProfile,
  regenerateShareToken,
};
