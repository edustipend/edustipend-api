const { Donation } = require("../models");

class Donate {
  static initializationUrl = 'https://api.paystack.co/transaction/initialize'
  static headers = {
    Authorization: `BEARER ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  }

  /**
   * @description create a new Paystack transaction
   * @param {object} data
   */
  static async makeDonation(details) {
    const fetchOptions = {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(details)
    };

    try {
      const response = await fetch(this.initializationUrl, fetchOptions);
      const data = await response.json();

      return data;
    } catch (err) {
      throw new ErrorHandler('Bad request', 400)
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
}

module.exports = Donate;
