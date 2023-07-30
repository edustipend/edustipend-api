const catchAsyncError = require("../middleware/catchAsyncError");
const { ApplicationWindow } = require("../services");
const {
  validateApplicationWindow
} = require("../validation/ApplicationWindowValidation");

/**
 * @description open a new application window
 * @route PUT /v1
 * @access private
 */

exports.setApplicationWindow = catchAsyncError(async (req, res, next) => {
  // First things first, set all previous "upcoming" statuses to "expired"
  await ApplicationWindow.expireAll();

  const validatedData = await validateApplicationWindow(req.body);

  await ApplicationWindow.create(validatedData.value);

  return res.status(201).json({
    success: true,
    message: "Application window has been set"
  });
});
