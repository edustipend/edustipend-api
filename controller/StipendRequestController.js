const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const { StipendRequest, Mail } = require("../services");
const {
  validateStipendRequest
} = require("../validation/StipendRequestValidation");

/**
 * @description Create a new stipend request
 * @route POST /v1/user/request-stipend
 * @access Private
 */

exports.requestStipend = catchAsyncError(async (req, res, next) => {
  const validateData = await validateStipendRequest(req.body);

  const stipend = await StipendRequest.create(validateData.value);

  Mail.sendRecievedStipendRequest(stipend.stipendCategory, stipend.email);

  return res.status(201).json({
    success: true,
    message: "Request successfully created"
  });
});
