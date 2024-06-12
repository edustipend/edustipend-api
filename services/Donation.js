const Logger = require("../config/logger");
const Donation = require("../models/Donation");
const ErrorHandler = require("../utils/ErrorHandler");
const Transaction = require("./Transaction");

class DonationService {
  /**
   * @description Makes a donation by calling Flutterwave APIs
   * @param {object} data
   */
  static async makeDonation(data) {
    try {
      const transaction = await Transaction.createTransaction(data);

      if (!transaction || transaction?.error) {
        throw new Error("Error creating request with Flutterwave");
      } else {
        return transaction.data;
      }
    } catch (err) {
      Logger.error(err);
      return { success: false };
    }
  }

  /**
   * @description Creates a new donation in Edustipend system after validating with Flutterwave
   * @param {object} data
   */
  static async createDonation(payload) {
    const { event, data } = payload;
    const { id, customer, ...transactionObj } = data;
    try {
      const donationData = {
        transactionId: id,
        donor: customer,
        event: event,
        transaction: transactionObj
      };
      const newDonation = new Donation(donationData);
      await newDonation.save();
      return newDonation;
    } catch (err) {
      Logger.error(err);
    }
  }

  /**
   * @description check whether donation has been previously recorded
   * @param {Number} transactionId
   */
  static async donationExists(transactionId) {
    try {
      // Query the database for a donation with the given id
      const existingDonation = await Donation.findOne({
        transactionId: transactionId
      });
      return existingDonation !== null;
    } catch (error) {
      console.error("Error checking donation existence:", error);
      return false;
    }
  }

  /**
   * @description get total donations
   */
  static async getTotal(startDate, endDate) {
    try {
      const matchQuery = {};
      if (startDate & endDate) {
        matchQuery.createdAt = { $gte: startDate, $lte: endDate };
      }

      const totalDonations = await Donation.aggregate([
        { $match: matchQuery },
        { $group: { _id: null, totalAmount: { $sum: "$transaction.amount" } } }
      ]);

      return {
        totalAmount:
          totalDonations?.length === 0 ? 0 : totalDonations[0].totalAmount
      };
    } catch (e) {
      Logger.error("Error getting total donations", JSON.stringify(e));
      throw new ErrorHandler(e, 500);
    }
  }

  /**
   * @description get total donations and donors
   */
  static async getTotalDonorsAndAmount() {
    try {
      const donationStats = await Donation.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$transaction.amount" },
            uniqueDonorsCount: { $addToSet: "$donor.email" },
            donationCount: { $sum: 1 }
          }
        }
      ]);
      const result = {
        totalAmount:
          donationStats.length > 0 ? donationStats[0].totalAmount : 0,
        uniqueDonorsCount:
          donationStats.length > 0
            ? donationStats[0].uniqueDonorsCount.length
            : 0,
        donationCount:
          donationStats.length > 0 ? donationStats[0].donationCount : 0
      };

      return result;
    } catch (e) {
      Logger.error("Error getting total donations", JSON.stringify(e));
      throw new ErrorHandler(e, 500);
    }
  }

  /**
   * @description get all donations
   * @param {Id} start
   * @param {Number} limit
   */
  static async getDonations(start, limit) {
    try {
      // const startIndex = (page - 1) * limit;

      // const donations = await Donation.find(
      //   {},
      //   { _id: 0, "donor.name": 1, "transaction.amount": 1, createdAt: 1 }
      // )
      //   .sort({ createdAt: -1 })
      //   .skip(startIndex)
      //   .limit(limit);

      // return donations;
      let query = {};

      // if start is provided, add to query
      if (start) {
        query._id = { $lt: start };
      }

      const donations = await Donation.find(query, {
        _id: 1,
        "donor.name": 1,
        "transaction.amount": 1,
        createdAt: 1
      })
        .sort({ _id: -1 }) // Sorting by _id in descending order
        .limit(limit);

      let next = null;

      if (donations.length > 0) {
        next = donations[donations.length - 1]._id;
      }

      return { donations, next };
    } catch (e) {
      Logger.error("Error getting total donations", JSON.stringify(e));
      throw new ErrorHandler(e, 500);
    }
  }
}

module.exports = DonationService;
