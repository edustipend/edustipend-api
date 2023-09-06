require("dotenv").config();
const jwt = require("jsonwebtoken");

const TOKEN_EXPIRATION_DEFAULT = "5d";

const generateJwtToken = function ({ id, isAdmin, name, email }) {
  return jwt.sign(
    {
      id,
      isAdmin,
      name,
      email
    },
    process.env.APP_TOKEN_KEY,
    {
      expiresIn: TOKEN_EXPIRATION_DEFAULT
    }
  );
};

module.exports = {
  generateJwtToken
};
