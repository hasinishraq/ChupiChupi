const AppError = require("../utils/appError");
const { verifyToken } = require("../utils/token");
const userRepo = require("../repositories/user.repo");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const payload = verifyToken(token);
    const user = await userRepo.findById(payload.sub);

    if (!user) {
      return next(new AppError("Unauthorized", 401));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new AppError("Unauthorized", 401));
  }
};

module.exports = auth;
