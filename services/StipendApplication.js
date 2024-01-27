const ObjectId = require("mongoose").Types.ObjectId;
const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");

class StipendApplication {
  /**
   * @description Create a new stipend application
   * @param {object} data
   */

  static async create(stipendApplication, user) {
    return await models.StipendApplication.create({
      ...stipendApplication,
      user
    });
  }

  /**
 * @description Find a single stipend application by id
 * @param {string} id
 */

  static async findById(id) {
    const stipendApplication = await models.StipendApplication.findOne({
      _id: id
    });
    return stipendApplication;
  }

  /**
   * @description Edit an existing stipend application
   * @param {object} data
   */
  static async update(stipendApplication) {
    const id = stipendApplication.applicationId;
    delete stipendApplication.applicationId;

    return await models.StipendApplication.findOneAndUpdate(
      { _id: id },
      stipendApplication,
      { new: true }
    );
  }

  /**
   * @description Get user's sorted stipend application history
   * @param {string} email
   */
  //TODO: Paginate this endpoint
  static async getHistory(userId) {
    const stipendApplicationHistory = await models.StipendApplication.find({
      user: new ObjectId(userId)
    });
    return stipendApplicationHistory;
  }

  /**
   * @description approve a stipend request
   * @param {string} stipendRequestId
   */

  static async approve({ stipendRequestIds }) {
    const stipend = await models.stipendRequest.update(
      { isApproved: true, isDenied: false },
      {
        where: { id: stipendRequestIds, isReceived: true }
      }
    );

    if (stipend[0] === 0) {
      throw new ErrorHandler("Application not found", 404);
    }
  }

  /**
   * @description Deny a stipend request
   * @param {string} stipendRequestId
   */

  static async deny({ stipendRequestIds }) {
    const stipend = await models.stipendRequest.update(
      { isApproved: false, isDenied: true },
      {
        where: { id: stipendRequestIds, isReceived: true }
      }
    );

    if (!stipend) {
      throw new ErrorHandler("Application not found", 404);
    }
  }
}

module.exports = StipendApplication;
