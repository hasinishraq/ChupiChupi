const bcrypt = require("bcryptjs");
const env = require("../config/env");
const AppError = require("../utils/appError");
const { signToken } = require("../utils/token");
const { createShareToken } = require("../utils/shareToken");
const userRepo = require("../repositories/user.repo");

const buildShareLink = (shareToken) => {
  const baseUrl = env.appBaseUrl.replace(/\/$/, "");
  return `${baseUrl}/u/${shareToken}`;
};

const generateUniqueShareToken = async () => {
  let shareToken = createShareToken();
  while (await userRepo.findByShareToken(shareToken)) {
    shareToken = createShareToken();
  }
  return shareToken;
};

const register = async ({ username, email, password }) => {
  const existingEmail = await userRepo.findAuthByEmail(email);
  if (existingEmail) {
    throw new AppError("Email already in use", 409);
  }

  const existingUsername = await userRepo.findByUsername(username);
  if (existingUsername) {
    throw new AppError("Username already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, env.security.bcryptSaltRounds);
  const shareToken = await generateUniqueShareToken();
  const user = await userRepo.createUser({
    username,
    email,
    passwordHash,
    shareToken,
  });
  const token = signToken({ sub: user.id });

  return { user, token, shareLink: buildShareLink(user.shareToken) };
};

const login = async ({ email, password }) => {
  const user = await userRepo.findAuthByEmail(email);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new AppError("Invalid credentials", 401);
  }

  const safeUser = await userRepo.findById(user.id);
  const token = signToken({ sub: user.id });

  return { user: safeUser, token, shareLink: buildShareLink(safeUser.shareToken) };
};

const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return { user, shareLink: buildShareLink(user.shareToken) };
};

const regenerateShareToken = async (userId) => {
  const shareToken = await generateUniqueShareToken();
  const user = await userRepo.updateShareToken(userId, shareToken);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return { user, shareLink: buildShareLink(user.shareToken) };
};

module.exports = {
  register,
  login,
  getProfile,
  regenerateShareToken,
};
