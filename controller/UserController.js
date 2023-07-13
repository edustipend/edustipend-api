//controller file
const catchAsyncError = require("../middleware/catchAsyncError");
const { requestStipend } = require("../services/StipendRequest")

/**
 * @route POST api/v1/request-stipend
 * @description Request a stipend
 * @access Private
 */

exports.requestStipend = catchAsyncError(async (req, res) => {
  const payload = req.body;

  await requestStipend(payload)

  return res.status(201).json({
    success: true,
    message: "Request successfully sent"
  });
});
