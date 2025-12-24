const AppError = require("../utils/appError");

const validate = (schema, property = "body") => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((item) => item.message).join(", ");
    return next(new AppError(details, 400));
  }

  req[property] = value;
  return next();
};

module.exports = validate;
