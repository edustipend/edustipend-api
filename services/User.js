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
  return await models.user.create({ ...data, isVerified, isCreateAccount });
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


}

module.exports = User;

