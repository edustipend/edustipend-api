const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");
const {
  Sequelize: { Op }
} = models;

class User {
  /**
   * Create a new user
   */

  static async create(data) {
    const isVerified = data.isVerified ? data.isVerified : false;
    const isCreateAccount = data.isCreateAccount ? data.isCreateAccount : false;

    if (isCreateAccount) {
      return await models.user.create({
        name: data.name,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        stateOfOrigin: data.stateOfOrigin,
        howDidYouHearAboutUs: data.howDidYouHearAboutUs,
        password: data.hashedPassword,
        isVerified,
        isCreateAccount
      });
    } else {
      // Create an account with isVerified and isCreateAccount set to false
      return await models.user.create({
        name: data.name,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        stateOfOrigin: data.stateOfOrigin,
        howDidYouHearAboutUs: data.howDidYouHearAboutUs,
        password: data.hashedPassword,
        isVerified: false,
        isCreateAccount: false
      });
    }
  }

  /**
   * @description Find a user by email
   * @param {string} email
   */

  static async findOne(email) {
    return await models.user.findOne({
      where: { email }
    });
  }

  /**
   * @description Find a user by email
   * @param {string} email
   */

  static async isUserVerified(email) {
    return await models.user.findOne({
      where: { email, isVerified: true }
    });
  }
}

module.exports = User;
