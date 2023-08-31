const catchAsyncError = require("../middleware/catchAsyncError");
const { StipendRequest, Mail } = require("../services");
const ErrorHandler = require("../utils/ErrorHandler");
const {
  validateStipendRequest,
  stipendRequestIdsValidation
} = require("../validation/StipendRequestValidation");

/**
 * @description Create a new stipend request
 * @route POST /v1/user/request-stipend
 * @access Private
 */

exports.requestStipend = catchAsyncError(async (req, res, next) => {
  const validateData = await validateStipendRequest(req.body);
  if (validateData.error) {
    throw new ErrorHandler(validateData.error, 400);
  }

  const stipend = await StipendRequest.create(validateData.value);

  Mail.sendRecievedStipendRequest(stipend.stipendCategory, stipend.email);

  return res.status(201).json({
    success: true,
    message: "Request successfully created",
    requestId: stipend.id
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

exports.applicationStatus = catchAsyncError(async (req, res, next) => {
  //get user id from req
  const userId = req.params.id;
  // convert it to an integer
  const parsedId = parseInt(userId);
  // check if id passed is a number
  if (isNaN(parsedId) || parsedId <= 0) {
    throw new ErrorHandler("must be an integer", 404);
  }
  // get id from database
  const application = await StipendRequest.appStatus(parsedId);
  // check if application exists in the database
  if (!application) {
    return res.status(404).json({
      success: true,
      message: "Application does not exist"
    });
  }
  // check if application is approved
  else if (application.isReceived === true && application.isApproved === true) {
    Mail.applicationStatusForApproved(
      application.email,
      application.stipendCategory
    );
    return res.status(200).json({
      success: true,
      message: "Approved"
    });
  }
  // check if application is denied
  else if (application.isReceived === true && application.isDenied === true) {
    Mail.applicationStatusForDenied(
      application.email,
      application.stipendCategory
    );
    return res.status(200).json({
      success: true,
      message: "Rejected"
    });
  }
  // check if application is under review
  else if (
    application.isReceived === true &&
    application.isApproved === false &&
    application.isDenied === false
  ) {
    Mail.applicationStatus(application.email, application.stipendCategory);
    return res.status(200).json({
      success: true,
      message: "Under Review"
    });
  }
  // check for any other factor
  else {
    return "Pending Review";
  }
});

/**
 * @description get a user application history
 * @route GET /v1/user/application-history
 * @access Private
 */

exports.applicationHistory = catchAsyncError(async (req, res, next) => {
  const userId = req.query.id;
  const parsedId = parseInt(userId);
  // check if id passed is a number
  if (isNaN(parsedId) || parsedId <= 0) {
    throw new ErrorHandler("must be an integer", 404);
  }
  const data = await StipendRequest.appHistory(parsedId);
  return res.status(200).json({
    success: true,
    message: data
  });
});

/**
 * @description get most recent stipend request
 * @route GET /v1/user/one-click-apply
 * @access Private
 */

exports.retrieveForOneClickApply = catchAsyncError(async (req, res, next) => {
  const lastUsedData = await StipendRequest.getMostRecent(req.params.email);

  return res.status(200).json({
    success: true,
    message: lastUsedData
  });
});
