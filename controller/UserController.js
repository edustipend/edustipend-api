const Logger = require("../config/logger");
const TokenExpiration = require("../constants/tokenExpiration");
const catchAsyncError = require("../middleware/catchAsyncError");
const {
	Authentication,
	Mail,
	StipendApplication,
	User
} = require("../services");
const ErrorHandler = require("../utils/ErrorHandler");
const { hasEmptySpace, getVerificationLink } = require("../utils/helper");
const {
	validateFirstStipendApplication
} = require("../validation/StipendApplicationValidation");

/**
 * @description Creates a new user and their first stipend application
 * @route POST /v1/user/stipend/apply
 * @access Private
 */
exports.createFirstStipendApplication = catchAsyncError(async (req, res) => {
	const passwordEmptySpace = hasEmptySpace(req.body.password);
	if (passwordEmptySpace) {
		throw new ErrorHandler("Password cannot contain empty space", 400);
	}

	const firstStipendApplicationData = validateFirstStipendApplication(req.body);
	if (firstStipendApplicationData.error) {
		throw new ErrorHandler(firstStipendApplicationData.error, 400);
	}

	const {
		dateOfBirth,
		email,
		gender,
		name,
		password,
		stateOfOrigin,
		futureHelpFromUser,
		potentialBenefits,
		reasonForRequest,
		stepsTakenToEaseProblem,
		stipendCategory
	} = firstStipendApplicationData.value;

	try {
		let newUser;

		try {
			newUser = await User.createUser({
				dateOfBirth,
				email,
				gender,
				name,
				password,
				stateOfOrigin,
				isAdmin: false,
				isVerified: false
			});
		} catch (err) {
			Logger.error(
				`Error creating user ${email} for first stipend application`,
				err
			);
			return res.status(500).json({
				error: err
			});
		}

		Logger.debug("New user created", newUser);
		let stipendApplication;

		if (newUser?._id) {
			// User has been created, now create stipend application
			try {
				stipendApplication = await StipendApplication.create(
					{
						futureHelpFromUser,
						potentialBenefits,
						reasonForRequest,
						stepsTakenToEaseProblem,
						stipendCategory
					},
					newUser
				);
			} catch (err) {
				Logger.error(
					`Error creating first stipend application for user ${email}`,
					err
				);
				return res.status(500).json({
					error: err
				});
			}

			Logger.debug("Stipend application created", stipendApplication);
			const { token, id } = await Authentication.getTokenForAuthenticatedUser(
				email,
				newUser,
				TokenExpiration.THIRTY_MINUTES
			);

			if (token && id) {
				const link = getVerificationLink(token);

				// TODO: Mail.sendVerificationCode(name, email, link); - Email confirming application received but needing to verify email
				//	Mail.sendRecievedStipendRequest(stipend.stipendCategory, stipend.email);

				return res.status(201).json({
					success: true,
					message:
						"Stipend application submitted successfully, please check your email for verification link",
					data: {
						userId: id,
						stipendApplicationId: stipendApplication._id,
						link //TODO: Remove this link
					}
				});
			} else {
				return res.status(500).json({
					error: "Error generating user token"
				});
			}
		}
	} catch (err) {
		return res.status(500).json({
			error: err
		});
	}
});

/**
 * @description
 * @route GET /v1/user/check
 * @access Private
 */
exports.isValidUser = catchAsyncError(async (req, res) => {
	const username = req.body.email || req.body.username;
	try {
		const data = await User.findByUserName(username);
		if (data) {
			return res.status(200).json({
				success: true,
				data: { username: data.username }
			});
		}
		return res.status(404).json({
			success: false,
			error: "User does not exist"
		});
	} catch (error) {
		Logger.error(`Error verifying if user ${username} exists`, error);
		return res.status(500).json({
			error
		});
	}
});

/**
 * @description
 * @route GET /v1/user/stipend/application-history
 * @access Private
 */
//TODO: Paginate this API
exports.stipendApplicationHistory = catchAsyncError(async (req, res) => {
	const userId = req.body.userId;
	try {
		const data = await StipendApplication.getHistory(userId);
		return res.status(200).json({
			success: true,
			data
		});
	} catch (error) {
		Logger.error(`Error getting user ${userId} application history`, err);
		return res.status(500).json({
			error
		});
	}
});

/**
 * @route POST /v1/user/verify
 * @description Verify a user email
 * @acess Private
 */
exports.verifyUser = catchAsyncError(async (_, res) => {
	const username = res.locals.verifiedUserName;

	try {
		const user = await User.markUserAsVerified(username);
		const { token } = await Authentication.getTokenForAuthenticatedUser(
			username,
			user,
			TokenExpiration.TWO_WEEKS
		);
		res.status(201).json({
			success: true,
			message: "Verified user successfully",
			token: `Bearer ${token}`
		});
	} catch (error) {
		Logger.error(error);
		res.status(500).json({
			success: false,
			message: "Unable to verify user",
			error
		});
	}
});
