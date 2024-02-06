const catchAsyncError = require("../middleware/catchAsyncError");
const { Waitlist, Mail } = require("../services");
const ErrorHandler = require("../utils/ErrorHandler");
const {
  validateWaitlistEntry
} = require("../validation/WaitlistEntryValidation");

/**
 * @description Adds a user to the notification waitlist
 * @route POST /v1/waitlist/join
 * @access Private
 */

exports.joinWaitlist = catchAsyncError(async (req, res) => {
  const validatedData = validateWaitlistEntry(req.body);
  if (validatedData.error) {
    throw new ErrorHandler(validatedData.error, 400);
  }

  const newWaitlistEntry = await Waitlist.addToWaitlist(validatedData.value);

  Mail.sendWelcomeToWaitlist(newWaitlistEntry.email, newWaitlistEntry.name);

  return res.status(201).json({
    success: true,
    message: "Successfully added to the waitlist"
  });
});

exports.notifyWaitlist = catchAsyncError(async (req, res) => {
  const users = await Waitlist.getPeopleInWaitlist();
  await Waitlist.notifyPeopleInWaitlist(users);
  return res.status(201).json({
    success: true,
    message: "Successfully notified the waitlist"
  });
});
