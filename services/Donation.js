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

			if (transaction?.error) {
				throw new Error('Error creating request with Flutterwave');
			}
			else {
				const donation = await this.createDonation(transaction?.data);
				return {
					success: true,
					data: donation
				};
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
	static async createDonation(data) {
		const { customer, ...transactionObj } = data;
		try {
			const donationData = {
				transactionId: data.id,
				donor: customer,
				event: data.event,
				transaction: transactionObj
			}
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
			const existingDonation = await Donation.findOne({ "transactionId": transactionId });
			return existingDonation !== null;
		} catch (error) {
			console.error("Error checking donation existence:", error);
			return false;
		}
	}
}

module.exports = DonationService;
