const Logger = require("../config/logger");
const Donation = require("../models/Donation");
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
  static async getTotal() {
    /**
     * @todo Find a way to sort it by weekly or daily etc. Allow it to be filterable
     */
    try {
      const totalDonations = await Donation.aggregate([
        { $group: { _id: null, totalAmount: { $sum: "$transaction.amount" } } }
      ]);

      if (totalDonations.length === 0) {
        return { totalAmount: 0 };
      }

      return { totalAmount: totalDonations[0].totalAmount };
    } catch (e) {
      throw new Error("Internal Server Error");
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
            uniqueDonorsCount: { $addToSet: "$donor.email" }
          }
        }
      ]);

      const result = {
        totalAmount:
          donationStats.length > 0 ? donationStats[0].totalAmount : 0,
        uniqueDonorsCount:
          donationStats.length > 0
            ? donationStats[0].uniqueDonorsCount.length
            : 0
      };

      return result;
    } catch (e) {
      throw new Error("Internal Server Error");
    }
  }

  /**
   * @description get all donations
   * @param {Number} page
   * @param {Number} limit
   */
  static async getDonations(page, limit) {
    try {
      const startIndex = (page - 1) * limit;

      // Count total donations (optional for pagination info)
      const totalDonations = await Donation.countDocuments();

      const donations = await Donation.find(
        {},
        { _id: 0, "donor.name": 1, "transaction.amount": 1, createdAt: 1 }
      )
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);

      return { totalDonations, donations };
    } catch (e) {
      throw new Error("Internal Server Error");
    }
  }
}

module.exports = DonationService;
