const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReferralLinkSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: String,
    originalURL: String,
    secureShortURL: String,
    shortURL: String,
    title: {
      type: String,
      default: "Edustipend | Support A Learner - Refer a friend"
    }
  },
  { timestamps: true }
);

const ReferralLinkModel = mongoose.model("ReferralLink", ReferralLinkSchema);

module.exports = ReferralLinkModel;
