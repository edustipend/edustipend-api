const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReferralSchema = new Schema(
  {
    tx_ref: {
      type: String,
      required: true,
      unique: true
    },
    campaign: {
      type: String,
      enum: ["Support A Learner", "Edustipend at 2"]
    },
    referrer: String,
    amount: Number,
    transactionCompleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const ReferralModel = mongoose.model("Referral", ReferralSchema);

module.exports = ReferralModel;
