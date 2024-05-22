const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonorSchema = new Schema({
  id: Number,
  name: String,
  phone_number: String,
  email: String,
  created_at: Date
});

const TransactionSchema = new Schema({
  tx_ref: String,
  flw_ref: String,
  amount: Number,
  currency: String,
  charged_amount: Number,
  app_fee: Number,
  merchant_fee: Number,
  processor_response: String,
  auth_model: String,
  status: String,
  payment_type: String,
  created_at: Date,
  account_id: Number
});

// The main schema
const DonationSchema = new Schema(
  {
    transactionId: {
      type: Number,
      required: true,
      unique: true
    },
    donor: {
      type: DonorSchema
    },
    event: {
      type: String,
      required: true
    },
    transaction: {
      type: TransactionSchema,
      required: true
    }
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", DonationSchema);

module.exports = Donation;
