const Donation = require('../models/Donation')

class Donate {
  /**
   * @description create a new Flutterwave transaction
   * @param {object} data
   */
  static async makeDonation(details) {
    const url = "https://api.flutterwave.com/v3/payments";
    const headers = {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      "Content-Type": "application/json"
    };
    const fetchOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(details)
    };

    try {
      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      if (data.status === "error") {
        return {
          success: false,
          error: data.errors
        };
      }

      return {
        success: true,
        data
      };
    } catch (err) {
      console.log(err.code);
      console.log(err.response.body);
    }
  }

  /**
   * @description record a new transaction in db
   * @param {object} data
   */
  static async recordTransaction(data){

    const newTransaction = new Donation({...data})
    await newTransaction.save()

    return newTransaction
  }

  /**
   * @description verify transaction status
   * @param {string} tx_ref
   */
  static async verifyTransaction(tx_ref, expectedAmount, expectedCurrency) {
    const url = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`
    const headers = {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
    };
    const fetchOptions = {
      method: 'GET',
      headers,
    }

    try {
      const rawData = await fetch(url, fetchOptions);
      const response = await rawData.json();

      if (
        response.data.status === "successful"
        && response.data.amount === expectedAmount
        && response.data.currency === expectedCurrency
      ) {
        // Success! Confirm the customer's payment
        return {
          success: true,
          data: response.data
        }
      } else {
          // Inform the customer their payment was unsuccessful
          return {
            success: false,
            error: "Not successful"
          };
      }
    } catch(err) {
      console.log(err.code);
      console.log(err.response.body);
    }
  }

  /**
   * @description check whether donation has been previously recorded
   * @param {Number} id
   */
  static async donationExists(id) {
    try {
    // Query the database for a donation with the given id
    const existingDonation = await Donation.findOne({ 'data.id': id });

    // If a donation with the given donation_id exists, return true
    // Otherwise, return false
    return existingDonation !== null;
    } catch (error) {
      console.error('Error checking donation existence:', error);
      return false;
    }
  }
}

module.exports = Donate;
