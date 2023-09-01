const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");

class StipendRequest {
  /**
   * @description Create a new stipend request
   * @param {object} data
   */

  static async create(data) {
    // Set hasReceivedStipendBefore to true if it is truthy, otherwise set it to false (default).
    const hasReceivedStipendBefore = !!data.hasReceivedStipendBefore;

    // Set isReceived to true (always) when creating the stipendRequest.
    const isReceived = true;

    return await models.stipendRequest.create({
      ...data,
      hasReceivedStipendBefore,
      isReceived
    });
  }

  /**
   * @description Find a single stipend request by stipendRequestId
   * @param {string} id
   */

  static async findById(id) {
    const stipendRequest = await models.stipendRequest.findByPk(id);
    if (stipendRequest === null) {
      throw new ErrorHandler("Application not found", 404);
    }
    return stipendRequest;
  }

  /**
   * @description get a user application status
   * @param {*} userId
   * @returns
   */

  static async appStatus(userId) {
    const application = await models.stipendRequest.findByPk(userId);
    if (application === null) {
      throw new ErrorHandler("Stipend application does not exist", 404);
    }
    return application;
  }

  static async appHistory(id) {
    const applicationHistory = await models.stipendRequest.findOne({
      where: { userId: id }
    });
    if (applicationHistory === null) {
      throw new ErrorHandler("user history does not exist", 404);
    }
    const history = {
      stipendCategory: applicationHistory.stipendCategory,
      isApproved: applicationHistory.isApproved,
      stepsTakenToEaseProblem: applicationHistory.stepsTakenToEaseProblem,
      potentialBenefits: applicationHistory.potentialBenefits,
      futureHelpFromUser: applicationHistory.futureHelpFromUser,
      createdAt: applicationHistory.createdAt
    };
    return history;
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

  /**
   * @description Get most recent stipend request
   * @param {string} email
   */

  static async getMostRecent(email) {
    const stipendRequest = await models.stipendRequest.findOne({
      where: {
        email: email
      },
      order: [["createdAt", "DESC"]]
    });

    if (!stipendRequest) {
      throw new ErrorHandler("No previous stipend request found", 404);
    }

    const filteredResponse = {
      id: stipendRequest.id,
      email: stipendRequest.email,
      stipendCategory: stipendRequest.stipendCategory,
      reasonForRequest: stipendRequest.reasonForRequest,
      stepsTakenToEaseProblem: stipendRequest.stepsTakenToEaseProblem,
      potentialBenefits: stipendRequest.potentialBenefits,
      futureHelpFromUser: stipendRequest.futureHelpFromUser
    };

    return filteredResponse;
  }
}

module.exports = StipendRequest;
