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
const { getVerificationLink } = require("../utils/helper");
const {
  validateStipendApplication,
  stipendRequestIdsValidation,
  validateUpdateStipendApplication
} = require("../validation/StipendApplicationValidation");

/**
 * @description Returning users requesting stipend
 * @route POST /v1/stipend/apply
 * @access Public
 */
exports.createStipendApplication = catchAsyncError(async (req, res) => {
  const validateData = validateStipendApplication(req.body);
  if (validateData.error) {
    throw new ErrorHandler(validateData.error, 400);
  }

  //TODO: Add validation logic to check if user already has an application in current window

  const { userId, ...applicationData } = validateData.value;
  const user = await User.findById(userId);
  if (user === null) {
    throw new ErrorHandler("User not found", 404);
  }

  try {
    let link;
    const stipendApplication = await StipendApplication.create(
      applicationData,
      user
    );
    Logger.debug("Stipend application created", stipendApplication);

    if (!user.isVerified) {
      const { token } = await Authentication.getTokenForAuthenticatedUser(
        user.username,
        user,
        TokenExpiration.THIRTY_MINUTES
      );
      link = getVerificationLink(token);
    }

    try {
      Mail.stipendApplicationReceivedConfirmation(
        stipendApplication.stipendCategory,
        user.username,
        user.name,
        link
      );
    } catch (error) {
      // Fail silently and retry
      Logger.error(error);
      Logger.info(`Retrying sending email to ${user.email}`);
      Mail.stipendApplicationReceivedConfirmation(
        stipendApplication.stipendCategory,
        user.username,
        user.name,
        link
      );
    }

    return res.status(200).json({
      success: true,
      message: "Stipend application submitted successfully",
      data: {
        stipendApplicationId: stipendApplication._id
      }
    });
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      message: "Error completing stipend application",
      error
    });
  }
});

/**
 * @description Logged in users update application
 * @route POST /v1/stipend/update
 * @access Public
 */
exports.updateStipendApplication = catchAsyncError(async (req, res) => {
  const validateData = validateUpdateStipendApplication(req.body);
  if (validateData.error) {
    throw new ErrorHandler(validateData.error, 400);
  }

  const { applicationId } = validateData.value;
  const stipend = await StipendApplication.findById(applicationId);
  if (stipend === null) {
    throw new ErrorHandler("Application not found", 404);
  }

  try {
    const updatedStipendApplication = await StipendApplication.update(
      validateData.value
    );
    return res.status(201).json({
      success: true,
      message: "Application successfully modified",
      data: {
        updatedStipendApplication
      }
    });
  } catch (error) {
    Logger.error(error);
    res.status(500).json({
      message: "Error updating stipend application",
      error
    });
  }
});

/**
 * @description get most recent stipend request
 * @route POST /v1/user/one-click-apply
 * @access Private
 */
exports.retrieveForOneClickApply = catchAsyncError(async (req, res, next) => {
  const lastUsedData = await StipendRequest.getMostRecent(req.params.email);

  return res.status(200).json({
    success: true,
    message: lastUsedData
  });
});

//Todo: add middleware to check for admin. This is an admin route
/**
 * @description approve a stipend request
 * @route PUT /v1/admin/approve-stipend
 * @access Private
 */
exports.approveStipend = catchAsyncError(async ({ body }, res, next) => {
  const validateData = await stipendRequestIdsValidation({
    ...body
  });

  await StipendRequest.approve({ ...validateData });

  return res.status(200).json({
    success: true,
    message: "Stipend request successfully approved"
  });
});

/**
 * @description approve a stipend request
 * @route PUT /v1/admin/reject-stipend
 * @access Private
 */
exports.rejectStipend = catchAsyncError(async ({ body }, res, next) => {
  const validateData = await stipendRequestIdsValidation({
    ...body
  });

  await StipendRequest.deny({ ...validateData });

  return res.status(200).json({
    success: true,
    message: "Stipend request successfully rejected"
  });
});
