const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require('jsonwebtoken')
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

  static async findUserByEmail(email) {
    return await models.User.findOne({where: email})
    
  }
  static async resetPassword(email){
    try {
      const oldUser = await models.User.findOne({where: email})
      if(!oldUser){
        throw new ErrorHandler('User does not exist', 404)
      }
      const secret = process.env.APP_TOKEN_KEY + oldUser.password
      const token = jwt.sign({email: oldUser.email, id: oldUser.id}, secret, {expiresIn:'5m'})
      const link = `http://localhost:4500/*reset-password*/${oldUser.id}/${token}`
    } catch (error) {}
  }
}




module.exports = User;
