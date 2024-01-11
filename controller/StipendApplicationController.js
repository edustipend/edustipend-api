const catchAsyncError = require("../middleware/catchAsyncError");
const {
  Mail,
  StipendApplication,
  User
} = require("../services");
const ErrorHandler = require("../utils/ErrorHandler");
const {
  validateStipendApplication,
  stipendRequestIdsValidation
} = require("../validation/StipendApplicationValidation");


/**
 * @description Returning users requesting stipend
 * @route POST /v1/stipend-apply
 * @access Public
 */
exports.createStipendApplication = catchAsyncError(async (req, res,) => {
  const validateData = validateStipendApplication(req.body);
  if (validateData.error) {
    throw new ErrorHandler(validateData.error, 400);
  }

  //TODO: Add logic to get user creating account and link it
  const stipend = await StipendApplication.create(validateData.value, /** applicantUser **/);

  // Mail.sendRecievedStipendRequest(stipend.stipendCategory, stipend.email);

  return res.status(201).json({
    success: true,
    message: "Request successfully created",
    data: {
      stipendApplicationId: stipend._id
    }
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
