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

    // Set application status to upcoming
    const status = "upcoming"

    // Check if application window with the same startDate exists
    const existingRecord = await models.applicationWindow.findOne({
      where: {
        startDate: data.startDate
      }
    })

    // if it exists, modify it with the new endDate
    if (existingRecord) {
      Object.assign(existingRecord, {
        ...data,
        status: "upcoming"
      })
      return await existingRecord.save()

    } // else, create a new record
    else {
      return await models.applicationWindow.create({
        ...data,
        status,
        isClosedByAdmin
      });
    }
  }


  /**
   * @description set all previous application windows to "expired"
   */
  static async expireAll() {
    return await models.applicationWindow.update(
      { status: "expired" },
      {
        where: {
          status: "upcoming"
        }
      }
    )
  }
}

module.exports = ApplicationWindow;
