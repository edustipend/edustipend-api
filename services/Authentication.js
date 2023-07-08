const bcrypt = require("bcryptjs");
const User = require("./User");
const Token = require("./Token");
const { randomSixDigits, validateEmail } = require("../utils/helper");
const ErrorHandler = require("../utils/ErrorHandler");
const models = require("../models");

class Authentication {
  /**
   * @param {string} password
   */

  static async hashpassword(password) {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
  }

  /**
   * @description Compare password
   * @param {*} data
   */

  static async comparePassword(password, dbpassword) {
    return bcrypt.compare(password, dbpassword);
  }

  /**
   * @description Register a new user
   * @param {object} data
   */

  static async register(data) {
    const {
      name,
      email,
      password,
      dateOfBirth,
      gender,
      stateOfOrigin,
      howDidYouHearAboutUs
    } = data;

    const hashedPassword = await this.hashpassword(password);
    await User.create({
      name,
      email,
      dateOfBirth,
      gender,
      stateOfOrigin,
      howDidYouHearAboutUs,
      hashedPassword
    });

    const code = randomSixDigits();
    await Token.genCode(email, code);

    return { name, email, code };
  }

  /**
   * @description Account Verification
   * @param {string} email
   * @param {string} link
   */

  static async verifyAccount({ email, verificationCode }) {
    if (!email) {
      throw new ErrorHandler("Email is required", 400);
    }
    if (!verificationCode) {
      throw new ErrorHandler("Verification code is required", 400);
    }

    const token = await Token.validateCode(verificationCode);

    const setVerify = models.user.update(
      { isVerified: true, isCreateAccount: true },
      { where: { email } }
    );

    const userInstance = User.findOne(email);
    const response = await Promise.all([setVerify, userInstance]);

    if (response[1] === null) {
      throw new ErrorHandler("User does not exist", 404);
    }

    Token.deleteEmail(token.email);

    const jwtToken = response[1].generateJwtToken();

    return {
      token: jwtToken,
      name: response[1].name,
      email: response[1].email
    };
  }
}

module.exports = Authentication;