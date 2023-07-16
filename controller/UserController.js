//controller file
const catchAsyncError = require("../middleware/catchAsyncError");
const models = require("../models");

exports.requestStipend = catchAsyncError(async (req, res) => {
  try {
    const payload = req.body;

    await models.laptopRequest.create({
      ...payload
    });

    return res.status(201).json({
      success: true,
      message: "Request successfully sent"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "Request not completed"
    });
  }
});
