const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WaitlistUserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false
    },
    email: {
      type: String,
      required: true,
      unique: false
    },
    hasBeenNotified: {
      type: Boolean,
      unique: false
    },
    howDidYouHearAboutUs: {
      type: String,
      enum: ["facebook", "google search", "instagram", "linkedin", "twitter", "other"],
      required: true
    },
  },
  { timestamps: true }
);

const WaitlistUserModel = mongoose.model("waitlistuser", WaitlistUserSchema);
module.exports = WaitlistUserModel;
