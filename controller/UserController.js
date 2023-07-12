//controller file
const catchAsyncError = require("../middleware/catchAsyncError");
const models = require("../models");

exports.requestStipend = catchAsyncError(async (req, res) => {
  const payload = req.body;

  await models.laptopRequest.create({
    ...payload
  });

  return res.status(201).json({
    success: true,
    message: "Request successfully sent"
  });
});
