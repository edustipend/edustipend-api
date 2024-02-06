const models = require("../models");
const ErrorHandler = require("../utils/ErrorHandler");
const Mail = require("./Mail");

class Waitlist {
  /**
   * @description Adds a user to waitlist
   * @param {object} data
   */
  static async addToWaitlist(data) {
    const hasBeenNotified = false;

    return await models.WaitlistUser.create({
      ...data,
      hasBeenNotified
    });
  }

  /**
   * @description Notify people in the waitlist
   */
  static async notifyPeopleInWaitlist(peopleObjects) {
    for (const people of peopleObjects) {
      const {email, name} = people;
      Mail.notifyWaitlistUser(email, name);
      await models.WaitlistUser.updateOne({ email }, { hasBeenNotified: true } );
    }
  }

  /**
   * @description Get people in the waitlist
   */
  static async getPeopleInWaitlist() {
    const condition = {
      hasBeenNotified: false
    };

    return await models.WaitlistUser.find(condition).select('email name')
  }
}

module.exports = Waitlist;
