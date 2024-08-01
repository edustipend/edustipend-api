const axios = require("axios");
const Logger = require("../config/logger");
const ReferralModel = require("../models/Referral");
const ReferralLink = require("../models/ReferralLink");
const { constructEncodedSALReferralUrl } = require("../utils/urlEncoder");

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
   * @description Creates a referral link in shortened URL form
   * @param {string} email 
   * @param {string} name 
   * @returns {object} response
   */
  static async createReferralLink(email, name) {
    let longFormEncodedUrl;
    let referralLink;

    // Check first if link already exists in our DB
    try {
      referralLink = await ReferralLink.findOne({
        email
      });

      if (referralLink) {
        Logger.info(`Link already created for ${email}, returning entry in DB`)
        return referralLink
      }
    }
    catch (e) {
      Logger.error(
        `Error finding referral link for ${email}`,
        e
      );
    }

    // Create long form encoded URL
    try {
      longFormEncodedUrl = constructEncodedSALReferralUrl(name, email);
    }
    catch (e) {
      Logger.error(
        `Error creating long form encoded referral url for ${email}`,
        e
      );
      return null;
    }

    Logger.info(`Creating short-form referral url from ${longFormEncodedUrl}`)

    // Make a call to Short.io to create the link
    try {
      const title = `Edustipend | Support A Learner - Refer a Friend: ${name}`;
      const headers = {
        Authorization: `${process.env.SHORT_IO_SECRET}`,
        "Content-Type": "application/json"
      };

      const response = await axios.post(
        process.env.SHORT_IO_API_ENDPOINT,
        {
          originalURL: longFormEncodedUrl,
          domain: process.env.REFERRAL_LINK_DOMAIN,
          title
        },
        { headers }
      );

      const data = response?.data;
      Logger.info(`Data response from Short IO API ${data}`)

      // Persist the Link in the DB
      const referralLink = await ReferralLink.create({
        email,
        name,
        title,
        originalURL: data?.originalURL,
        secureShortURL: data?.secureShortURL,
        shortURL: data?.secureShortURL.replace('https', 'http')
      });

      return referralLink;
    } catch (error) {
      Logger.error(
        `Error creating new short-form referral link for ${email}`,
        e
      );
      throw error;
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
