const { Donate } = require("../services");
const catchAsyncError = require("../middleware/catchAsyncError");
const Logger = require("../config/logger");

/**
 * @description Donate
 * @route POST /v1/donate
 * @access PUBLIC
 */
exports.donateNow = catchAsyncError(async (req, res) => {
  /**
   * @todo Handle validation for req.body
   */

  const donation = await Donate.makeDonation(req.body);
  console.log("donation is", donation);
  if (donation.status === true)
    return res.status(201).json({
      status: true,
      message: "Follow this link to complete donation",
      data: donation.data
    });
  else
    return res.status(500).json({
      status: false,
      message: "Unfortunately, something happened"
    });
});

/**
 * @description Paystack web hook
 * @route POST /v1/donate/paystack-webhook
 */
exports.paystackWebhook = catchAsyncError(async (req, res) => {
  const payload = req.body
  const paystackSignature = req.headers['x-paystack-signature']
  const secret = process.env.PAYSTACK_SECRET_KEY

  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(payload)).digest('hex')
  if (hash === paystackSignature) {
    
    const { 
      reference, 
      amount, 
      currency, 
      status, 
      channel,
      customer,
      paid_at,
      created_at,
      fees,
    } = payload.data

    // store donation details in the Database
    const newDonation = await Donate.recordTransaction({
      reference,
      amount,
      currency,
      status,
      channel,
      customer,
      paid_at,
      created_at,
      fees
    })

    if (!newDonation) {
      Logger.error(`Error recording transaction of ID ${reference}`);
    }

    return res.status(200).send('Received Paystack Event')
  } else {
    return res.status(401).json({
      status: false,
      message: 'Unauthorized action'
    })
  }
});
