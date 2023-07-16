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

module.exports = StipendRequest;
