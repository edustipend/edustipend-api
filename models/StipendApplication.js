const mongoose = require('mongoose');
const ApplicationStatus = require('../constants/applicationStatus');
const StipendCategory = require('../constants/stipendCategory');
const Schema = mongoose.Schema;

const StipendApplicationSchema = new Schema({
	futureHelpFromUser: {
		type: String,
		required: true,
		unique: false
	},
	potentialBenefits: {
		type: String,
		required: true,
		unique: false
	},
	reasonForRequest: {
		type: String,
		required: true,
		unique: false
	},
	stepsTakenToEaseProblem: {
		type: String,
		required: true,
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
		required: true,
		unique: false
	},
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},
	{ timestamps: true }
);


const StipendApplicationModel = mongoose.model('StipendApplication', StipendApplicationSchema);
module.exports = StipendApplicationModel;