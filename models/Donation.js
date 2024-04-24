const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  id: Number,
  name: String,
  phone_number: String,
  email: String,
  created_at: Date
})

const DataSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
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
  account_id: Number,
  customer: {
    type: CustomerSchema
  },
})

// The main schema
const DonationSchema = new Schema({
  event: {
    type: String,
    required: true
  },
  data: {
    type: DataSchema,
    required: true
  },
})

const Donation = mongoose.model('Donation', DonationSchema)

module.exports = Donation