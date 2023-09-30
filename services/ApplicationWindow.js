const models = require("../models");
const { Op } = require("sequelize");
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
    let status = "upcoming";

    // Check if application window with the same startDate exists
    const existingRecord = await models.applicationWindow.findOne({
      where: {
        startDate: data.startDate
      }
    });

    // check if the start date is the same as the current date, and set status to active
    const currentDate = new Date();
    const currentDateOnly = currentDate.toISOString().split("T")[0];

    // compare both dates in ISO format
    if (data.startDate.toISOString().split("T")[0] === currentDateOnly) {
      status = "active";
    }

    // if it exists, modify it with the new endDate
    if (existingRecord) {
      Object.assign(existingRecord, {
        ...data,
        status
      });
      return await existingRecord.save();
    } // else, create a new record
    else {
      await this.expireAll();
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
          status: {
            [Op.or]: ["active", "upcoming"]
          }
        }
      }
    );
  }

  /**
   * @description manually close an application window
   */
  static async manuallyClose() {
    return await models.applicationWindow.update(
      {
        isClosedByAdmin: true,
        status: "expired"
      },
      {
        where: {
          [Op.or]: [{ status: "active" }, { status: "upcoming" }]
        }
      }
    );
  }

  /**
   * @description returns a boolean on whether application window is open or not
   */
  static async isOpen() {
    const isWindowOpen = await models.applicationWindow.findOne({
      where: {
        status: "active",
        isClosedByAdmin: false
      }
    });

    // return boolean equivalent of isWindowOpen
    return !!isWindowOpen;
  }
}

module.exports = ApplicationWindow;
