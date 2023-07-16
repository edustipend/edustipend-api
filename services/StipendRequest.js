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

    return await models.stipendRequest.create({
      ...data,
      hasReceivedStipendBefore
    });
  }
}

module.exports = StipendRequest;
