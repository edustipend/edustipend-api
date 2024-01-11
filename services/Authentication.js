const bcrypt = require("bcryptjs");
const { findByUserName } = require("./User");
const ErrorHandler = require("../utils/ErrorHandler");
const models = require("../models");
//TODO: Deprecate this
const { generateJwtToken } = require("../utils/generateJwtToken");
const User = require("../models/UserV2");
const Logger = require("../config/logger");
const TokenExpiration = require("../constants/tokenExpiration");

class Authentication {
  /**
   * @param {string} password
   */
  static async hashpassword(password) {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
  }

  /**
   * @description Login a user
   * @param {object} username - email
   * @param {string} password
   */
  static async loginUser({ username }) {
    let user, authRes;

    try {
      user = await findByUserName(username);
      authRes = await this.getTokenForAuthenticatedUser(
        username,
        user,
        TokenExpiration.TWO_WEEKS
      );
    } catch (err) {
      Logger.error(err);
      throw new ErrorHandler(err.message, 500);
    }

    return {
      success: true,
      message: "Sign in successful",
      token: `Bearer ${authRes.token}`
    };
  }

  /**
   * @description Gets token for authenticated user
   * @param {object} data
   */
  static async getTokenForAuthenticatedUser(email, user, expiresIn) {
    try {
      let theUser = user;
      if (!theUser) {
        theUser = await User.findOne({ username: email });
      }
      const id = theUser?._id;
      const token = User.generateJwtToken(theUser, expiresIn);
      return { token, id };
    } catch (err) {
      Logger.error("Error getting token for authentocated user", err);
      return null;
    }
  }

  /**
   * @description Issue a token to reset user password
   * @param {object} userData
   */
  static async resetPassword(userData) {
    const { email } = userData;
    if (!email) {
      throw new ErrorHandler("Email is required", 400);
    }
    const token = await this.getTokenForAuthenticatedUser(
      email,
      userData,
      TokenExpiration.THIRTY_MINUTES
    );
    return token;
  }
}

module.exports = Authentication;
