const mongoose = require("mongoose");
const ApplicationStatus = require("../constants/applicationStatus");
const StipendCategory = require("../constants/stipendCategory");
const Schema = mongoose.Schema;

const StipendApplicationSchema = new Schema(
  {
    futureHelpFromUser: {
      type: String,
      required: [
        function () { return !this.parentApplication; },
        'futureHelpFromUser is required if no parentApplication'
      ],
      unique: false
    },
    potentialBenefits: {
      type: String,
      required: [
        function () { return !this.parentApplication; },
        'potentialBenefits is required if no parentApplication'
      ],
      unique: false
    },
    reasonForRequest: {
      type: String,
      required: [
        function () { return !this.parentApplication; },
        'reasonForRequest is required if no parentApplication'
      ],
      unique: false
    },
    stepsTakenToEaseProblem: {
      type: String,
      required: [
        function () { return !this.parentApplication; },
        'stepsTakenToEaseProblem is required if no parentApplication'
      ],
      unique: false
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.RECEIVED,
      unique: false
    },
    stipendCategory: {
      type: String,
      enum: Object.values(StipendCategory),
      required: [
        function () { return !this.parentApplication; },
        'stipendCategory is required if no parentApplication'
      ],
      unique: false
    },
    parentApplication: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const StipendApplicationModel = mongoose.model(
  "StipendApplication",
  StipendApplicationSchema
);
module.exports = StipendApplicationModel;
