const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");
const { dateDiff, cryptWords } = require("../utils/helper");

class Token {
  /**
   * @description Store verification code
   * @param {*} email
   * @param {*} code
   */
  static async genCode(email, code) {
    await models.token.create({
      email,
      code
    });
  }

  /**
   * @description Store reset token
   * @param {*} email
   * @param {*} code
   */
  static async resetToken(email, token) {
    await models.token.create({
      email,
      token: cryptWords(token)
    });
  }

  /**
   * @description Find verification code
   * @param {*} email
   * @param {*} code
   */
  static async findCode(email, code) {
    const token = await models.token.findOne({ where: { email, code } });
    return token;
  }

  static async validateCode(email, code) {
    const token = await this.findCode(email, code);
    console.log("The token is", token);

    if (token === null) {
      throw new ErrorHandler("Invalid Verification code", 401);
    }

    // if (dateDiff(token.createdAt) > 20) {
    //   throw new ErrorHandler("Invalid Verification code", 401);
    // }
    return token;
  }

  static async validateToken(token) {
    const resetToken = await this.findToken(cryptWords(token));

    if (resetToken === null) {
      throw new ErrorHandler("Invalid token", 401);
    }

    if (dateDiff(resetToken.createdAt) > 20) {
      throw new ErrorHandler("Invalid token", 401);
    }
    return resetToken;
  }
  /**
   * @description Find Reset Token
   * @param {*} email
   * @param {*} code
   */
  static async findToken(token) {
    return await models.token.findOne({ where: { token } });
  }

  /**
   * @description Delete token by email
   * @param {*} email
   * @param {*} code
   */
  static async deleteEmail(email) {
    await models.token.destroy({ where: { email } });
  }
}

module.exports = Token;
