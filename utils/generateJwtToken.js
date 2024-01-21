require("dotenv").config();
const jwt = require("jsonwebtoken");

const TOKEN_EXPIRATION_DEFAULT = "1h";

const generateJwtToken = (data, expiresIn) => {
  return jwt.sign(data, process.env.APP_TOKEN_KEY, {
    expiresIn: expiresIn || TOKEN_EXPIRATION_DEFAULT
  });
};

const verifyJWTToken = (token, opts) => {
  return jwt.verify(token, process.env.APP_TOKEN_KEY, opts ?? null);
};

module.exports = {
  generateJwtToken,
  verifyJWTToken
};
