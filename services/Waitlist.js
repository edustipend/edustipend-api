const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");
const Mail = require("./Mail");

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
  static async notifyPeopleInWaitlist(peopleObjects) {
    for (const people of peopleObjects) {
      const email = people.email;
      Mail.sendWelcomeToWaitlist(email);
      await models.waitlist.update(
        {
          hasBeenNotified: true
        },
        {
          where: {
            email
          }
        }
      );
    }
  }

  /**
   * @description Get people in the waitlist
   */
  static async getPeopleInWaitlist() {
    const condition = {
      hasBeenNotified: false
    };

    const columnsToRetrieve = ["email"];

    return await models.waitlist.findAll({
      where: condition,
      attributes: columnsToRetrieve
    });
  }
}

module.exports = Waitlist;
