const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");

class Waitlist {
  /**
   * @description Add an email to waitlist
   * @param {object} data
   */

  static async addToWaitlist(data) {
    const hasBeenNotified = false;

    return await models.waitlist.create({
      ...data,
      hasBeenNotified
    });
  }

  /**
   * @description Notify people in the waitlist
   */
  static async notifyPeopleInWaitlist() {}
}

module.exports = Waitlist;
