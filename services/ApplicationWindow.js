const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");

class ApplicationWindow {
  /**
   * @description create new application window
   * @param {object} data
   */

  static async create(data) {
    // Set isClosedByAdmin to true if it is truthy, otherwise set it to false (default).
    const isClosedByAdmin = !!data.isClosedByAdmin;

    return await models.applicationWindow.create({
      ...data,
      isClosedByAdmin
    });
  }
}

module.exports = ApplicationWindow
