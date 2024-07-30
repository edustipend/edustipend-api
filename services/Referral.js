const Logger = require("../config/logger");
const ReferralModel = require("../models/Referral");

class Referral {
  /**
   * @description Creates a new referral to the table
   * @param {object} data
   */
  static async createReferral(object) {
    try {
      const newReferral = await ReferralModel.create(object);
      return newReferral;
    } catch (e) {
      Logger.error(
        `Could not add referral for transaction of ref ${object.tx_ref} due to error`,
        e
      );
      return null;
    }
  }

  /**
   * @description Update a referral transaction to true
   * @param {string} tx_ref
   */
  static async updateReferral(tx_ref) {
    return await ReferralModel.findOneAndUpdate(
      { tx_ref },
      { transactionCompleted: true },
      { new: true }
    );
  }

  /**
   * @description retrieve all successful referral donations
   */
  static async getReferrals(referrer = null) {
    const filter = { transactionCompleted: true };

    if (referrer) {
      filter.referrer = referrer;
    }

    return await ReferralModel.find(filter);
  }

  /**
   * @description retrieves the top n donors
   * where n is the integer passed to param 'top'
   * to represent hierarchy of referrer donations
   * @param {integer} [top=null]
   */
  static async getTopReferrers(top = null) {
    const aggregationPipeline = [
      { $match: { transactionCompleted: true } },
      { $group: { _id: "$referrer", totalAmount: { $sum: "$amount" } } },
      { $sort: { totalAmount: -1 } }
    ];

    if (top) {
      aggregationPipeline.push({ $limit: parseInt(top) });
    }

    return await ReferralModel.aggregate(aggregationPipeline);
  }
}

module.exports = Referral;
