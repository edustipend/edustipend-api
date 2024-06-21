const axios = require("axios");
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
      headers
    };

    try {
      const response = await axios.post(url, reqObj, fetchOptions);
      return {
        success: true,
        data: response?.data
      };
    } catch (err) {
      Logger.error(
        `Error status of ${err.response.status}
        Email: ${reqObj.email}
        Amount: ${reqObj.amount}
        Transaction ref: ${reqObj.tx_ref}`
      );
      return {
        success: false,
        error: err?.response?.data
      };
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
      headers
    };

    try {
      const response = await axios.get(url, reqObj, fetchOptions);
      const data = response?.data;

      if (
        data.status === "successful" &&
        data.amount === expectedAmount &&
        data.currency === expectedCurrency
      ) {
        return {
          success: true,
          data
        };
      } else {
        throw new Error("Transaction verification failed");
      }
    } catch (err) {
      Logger.error(
        `Verifying transaction of id ${tx_ref} a& expected amount ${expectedAmount} causes ${JSON.stringify(
          err
        )}`
      );
      return {
        success: false,
        error: "Not successful"
      };
    }
  }
}

module.exports = Transaction;
