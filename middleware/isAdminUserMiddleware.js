const Logger = require("../config/logger");
const ErrorMessage = require("../constants/error");
// const { verifyJWTToken } = require("../utils/generateJwtToken");

exports.isAdminUser = async function (req, res, next) {
	// TODO: Update this to read from the headers
	const adminHeaders = req.headers['x-admin-user'];

	// TODO: Add logic to verify headers
	if (adminHeaders) {
		next();
	}
	else {
		Logger.error(err);
		return res.status(401).json({
			message: ErrorMessage.UNAUTHORIZED,
			error: true
		});
	}
};
