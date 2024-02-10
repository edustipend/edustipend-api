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
  validateBatchApproveRequest,
  validateStipendApplication,
  stipendRequestIdsValidation,
  validateUpdateStipendApplication,
  validateOneClickApplyStipendApplication,
  validateAdminUpdateStipendApplicationStatus
} = require("../validation/StipendApplicationValidation");

const handleSubmitStipendApplication = async function (
  applicationData,
  user,
  res
) {
  // TODO: Add validation logic to check if user
  // is already has an application in current window

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
      message: "Error submitting stipend application",
      error
    });
  }
};

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

  const { userId, ...applicationData } = validateData.value;
  const user = await User.findById(userId);
  if (user === null) {
    throw new ErrorHandler("User not found", 404);
  }

  handleSubmitStipendApplication(applicationData, user, res);
});

/**
 * @description Logged in users update application
 * @route POST /v1/stipend/update
 * @access Public
 */
exports.updateStipendApplication = catchAsyncError(async (req, res) => {
  const { userId, ...applicationData } = req.body;
  const validateData = validateUpdateStipendApplication(applicationData);
  if (validateData.error) {
    throw new ErrorHandler(validateData.error, 400);
  }

  const { applicationId } = validateData.value;
  const stipendApplication = await StipendApplication.findById(applicationId);
  if (stipendApplication === null) {
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
 * @description One-click apply - reuse existing application
 * @route POST /v1/stipend/apply/one-click
 * @access Private
 */
exports.oneClickApply = catchAsyncError(async (req, res) => {
  const validatedData = validateOneClickApplyStipendApplication(req.body);
  if (validatedData.error) {
    throw new ErrorHandler(validatedData.error, 400);
  }

  const { userId, ...applicationData } = validatedData.value;
  const user = await User.findById(userId);
  if (user === null) {
    throw new ErrorHandler("User not found", 404);
  }

  const parentStipendApplication = await StipendApplication.findById(
    applicationData.parentApplication
  );
  if (parentStipendApplication === null) {
    throw new ErrorHandler("Parent application not found", 404);
  }

  const stipendApplicationData = {
    futureHelpFromUser:
      applicationData.futureHelpFromUser ??
      parentStipendApplication.futureHelpFromUser,
    potentialBenefits:
      applicationData.potentialBenefits ??
      parentStipendApplication.potentialBenefits,
    reasonForRequest:
      applicationData.reasonForRequest ??
      parentStipendApplication.reasonForRequest,
    stepsTakenToEaseProblem:
      applicationData.stepsTakenToEaseProblem ??
      parentStipendApplication.stepsTakenToEaseProblem,
    stipendCategory:
      applicationData.stipendCategory ??
      parentStipendApplication.stipendCategory,
    parentApplication: applicationData.parentApplication
  };

  handleSubmitStipendApplication(stipendApplicationData, user, res);
});

/**
 * @description Batch update stipend applications from verified USERS to REVIEW
 * @route PUT /v1/admin/applications/batch/update-status
 * @access Private
 */
exports.updateStipendApplicationsToReviewStatus = catchAsyncError(
  async (req, res) => {
    const validatedData = validateAdminUpdateStipendApplicationStatus(req.body);
    if (validatedData.error) {
      throw new ErrorHandler(validatedData.error, 400);
    }

    try {
      const updatedStipendApplications = await StipendApplication.batchUpdate(
        validatedData.value,
        req.body.startDate,
        req.body.endDate
      );
      return res.status(201).json({
        success: true,
        message: `Application status successfully updated for ${updatedStipendApplications.modifiedCount} records`,
        data: {
          updatedStipendApplication: updatedStipendApplications
        }
      });
    } catch (error) {
      Logger.error(error);
      res.status(500).json({
        message: "Error setting status of stipend applications",
        error
      });
    }
  }
);


/**
 * @description Batch approve VERIFIED stipend applications and set others to UNAPPROVED for specific window
 * @route PUT /v1/admin/applications/batch/approve
 * @access Private
 */
exports.batchApproveStipendApplications = catchAsyncError(
  async (req, res) => {
    const validatedData = await validateBatchApproveRequest(req.body);
    if (validatedData.error) {
      throw new ErrorHandler(validatedData.error, 400);
    }

    try {
      const data = await StipendApplication.batchApprove(
        validatedData.applicationIds,
        "2023-12-31T00:00:00Z",
        "2024-01-31T00:00:00Z"
      );
      return res.status(201).json({
        success: true,
        message: `Application status successfully updated`,
        data
      })
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({
        message: "Error batch approving status applications",
        error
      });
    }
  }
);

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
