const Logger = require("../config/logger");
const Donation = require("../models/Donation");

class Transaction {
  /**
   * @description Makes a call to Fluttwerave to create a new transaction
   * @param {object} data
   */
  static async createTransaction(reqObj) {
    const url = "https://api.flutterwave.com/v3/payments"; //@TODO: Move this to environment variable
    const headers = {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      "Content-Type": "application/json"
    };
    const fetchOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(reqObj)
    };

    try {
      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      if (data.status === "error") {
        /**
         * @todo log this
         */
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
      Logger.error(err.code);
      Logger.error(err.response.body);
    }
  }

  /**
   * @description verify transaction status
   * @param {string} tx_ref
   */
  static async verifyTransaction(tx_ref, expectedAmount, expectedCurrency) {
    const url = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`;
    const headers = {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
    };
    const fetchOptions = {
      method: "GET",
      headers
    };

    try {
      const rawData = await fetch(url, fetchOptions);
      const response = await rawData.json();

      if (
        response.data.status === "successful" &&
        response.data.amount === expectedAmount &&
        response.data.currency === expectedCurrency
      ) {
        // Success! Confirm the customer's payment
        return {
          success: true,
          data: response.data
        };
      } else {
        /**
         * @todo log the failure
         */
        // Inform the customer their payment was unsuccessful
        return {
          success: false,
          error: "Not successful"
        };
      }
    } catch (err) {
      Logger.error("The transaction is false");
    }
  }
}

module.exports = Transaction;
