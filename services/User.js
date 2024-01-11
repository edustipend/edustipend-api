const UserModel = require("../models/UserV2");
const ErrorHandler = require("../utils/ErrorHandler");
const Logger = require("../config/logger");

class UserService {
  /**
   * @description Creates a new user
   * @param {object} data
   */
  static async createUser(data) {
    const { email, password } = data;
    delete data.password;

    return new Promise((resolve, reject) => {
      try {
        UserModel.register(
          new UserModel({
            ...data,
            username: email,
            isVerified: false
          }),
          password,
          async (err, user) => {
            if (err) {
              reject(err);
            } else {
              resolve(user);
            }
          }
        );
      } catch (err) {
        Logger.error(err);
        reject(err);
      }
    });
  }

  /**
   * @description Find a user by username (email)
   * @param {string} username
   */
  static async findByUserName(username) {
    return UserModel.findOne({ username });
  }

  /**
   * @description Update user password
   * @param {object} userData
   */
  static async updatePassword(newPassword, userToReset) {
    if (!newPassword) {
      throw new ErrorHandler("password is required", 400);
    }
    // TODO: Add double confirmation for reset
    // if (password !== confirmPassword) {
    //   throw new ErrorHandler("passwords does not match", 400);
    // }
    userToReset.setPassword(newPassword, (err) => {
      if (err) {
        throw err;
      }
      userToReset.save();
    });
    Logger.info("Password reset sucessfully for ", userToReset?._id);
  }

  /**
   * @description Find a user by certain search criteria
   * @param {object} filterOpts
   */
  static async findUserByProperty(filterOpts) {
    return await UserModel.findOne(filterOpts);
  }

  /**
   * @description Mark user as verified
   * @param {string} username
   */
  static async markUserAsVerified(username) {
    return await UserModel.findOneAndUpdate(
      { username },
      { isVerified: true },
      { new: true }
    );
  }
}

module.exports = UserService;
