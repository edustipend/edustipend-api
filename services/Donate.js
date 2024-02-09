class Donate {
  /**
   * @description create a new Flutterwave transaction
   * @param {object} data
   */
  static async makeDonation(details) {
    console.log("the secret is ", process.env.FLW_SECRET_KEY);
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
}

module.exports = Donate;
