const catchAsyncError = require("../middleware/catchAsyncError");
const { Waitlist, Mail } = require("../services");
const {
  validateWaitlistEntry
} = require("../validation/WaitlistEntryValidation");

/**
 * @description Add an email to the notification waitlist
 * @route POST /v1/join-waitlist
 * @access Private
 */

exports.joinWaitlist = catchAsyncError(async (req, res, next) => {
  const validatedData = await validateWaitlistEntry(req.body);

  const newWaitlistEntry = await Waitlist.addToWaitlist(validatedData.value);

  Mail.sendWelcomeToWaitlist(newWaitlistEntry.email);

  return res.status(201).json({
    success: true,
    message: "Successfully added to the waitlist"
  });
});

exports.notifyWaitlist = catchAsyncError(async (req, res, next) => {
  const emails = await Waitlist.getPeopleInWaitlist();
  await Waitlist.notifyPeopleInWaitlist(emails);
  return res.status(201).json({
    success: true,
    message: "Successfully notified the waitlist"
  });
});
