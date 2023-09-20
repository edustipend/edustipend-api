const bcrypt = require("bcryptjs");
const User = require("./User");
const Token = require("./Token");
const { randomSixDigits, validateEmail } = require("../utils/helper");
const ErrorHandler = require("../utils/ErrorHandler");
const models = require("../models");
const { generateJwtToken } = require("../utils/generateJwtToken");

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
    const newUser = await User.create({
      name,
      email,
      dateOfBirth,
      gender,
      stateOfOrigin,
      howDidYouHearAboutUs,
      hashedPassword
    });

    const code = randomSixDigits();
    const { id } = newUser;

    await Token.genCode(email, code);

    return { name, email, code, id };
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

    const verifiedUser = await User.isUserVerified(email);
    if (verifiedUser) {
      const jwtToken = generateJwtToken(verifiedUser);

      return {
        token: jwtToken,
        name: verifiedUser.name,
        email: verifiedUser.email,
        message: "User already verified"
      };
    }

    const token = await Token.validateCode(email, verificationCode);

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
      email: response[1].email,
      message: "Account Verification successful."
    };
  }

  static async passwordReset(data) {
    const { name, email } = data;
    if (!email) {
      throw new ErrorHandler("Email is required", 400);
    }
    if (!name) {
      throw new ErrorHandler("Name is required", 400);
    }

    const oldUserEmail = await models.user.findOne({ where: { email } });
    if (oldUserEmail === null) {
      throw new ErrorHandler("User not found", 404);
    }
    const code = randomSixDigits();
    await Token.genCode(email, code);
    return { name, email, code };
  }

  static async passwordUpdate({
    email,
    verificationCode,
    password,
    confirmPassword
  }) {
    if (!email) {
      throw new ErrorHandler("Email is required", 400);
    }
    if (!verificationCode) {
      throw new ErrorHandler("Verification code is required", 400);
    }
    const token = await Token.validateCode(email, verificationCode);
    const setVerify = models.user.update(
      { code: verificationCode },
      { where: { email } }
    );
    const userInstance = User.findOne(email);
    const response = await Promise.all([setVerify, userInstance]);
    if (response[1] === null) {
      throw new ErrorHandler("User does not exist", 404);
    }
    if (!password) {
      throw new ErrorHandler("password is required", 400);
    }
    if (password !== confirmPassword) {
      throw new ErrorHandler("passwords does not match", 400);
    }
    // User.update({ password: 'new_password' }, { where: { email: 'user@example.com' } });

    const hashedPassword = await this.hashpassword(password);

    const newPassword = await models.user.update(
      { password: hashedPassword },
      { where: { email: email } }
    );

    Token.deleteEmail(token.email);
    const jwtToken = response[1].generateJwtToken();

    return {
      token: jwtToken,
      name: response[1].name,
      email: response[1].email
    };
  }

  /**
   * @description Login a user
   * @param {object} email
   * @param {string} password
   */

  static async loginUser({ email, password }) {
    const newUser = await User.findOne(email);
    let data;
    if (newUser === null) {
      throw new ErrorHandler("Invalid credential", 401);
    }

    const checkPassword = await newUser.comparePassword(password);
    if (!checkPassword) {
      throw new ErrorHandler("Invalid credential", 401);
    }
    data = newUser.generateJwtToken();

    return {
      success: true,
      message: "Sign in successful",
      token: `Bearer ${data}`
    };
  }
}

module.exports = Authentication;
