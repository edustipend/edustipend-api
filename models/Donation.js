const mongoose = require("mongoose")
const Schema = mongoose.Schema

const customerSchema = new mongoose.Schema({
  email: String,
  id: {
    type: Number,
    required: true
  }
}, { _id: false })

const donationSchema = new Schema({
  reference: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  channel: String,
  currency: String,
  status: String,
  paid_at: Date,
  createdAt: Date,
  fees: Number,
  customer: customerSchema,
})

const Donation = mongoose.model('Donation', donationSchema)

module.exports = Donation