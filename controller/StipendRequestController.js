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
    throw new ErrorHandler(validateData.error, 400)
  }

  const stipend = await StipendRequest.create(validateData.value);

  Mail.sendRecievedStipendRequest(stipend.stipendCategory, stipend.email);

  return res.status(201).json({
    success: true,
    message: "Request successfully created"
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
