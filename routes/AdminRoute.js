const {
  approveStipend,
  rejectStipend
} = require("../controller/StipendApplicationController");
const { notifyWaitlist } = require("../controller/WaitlistController");
const {
  setApplicationWindow,
  manuallyCloseApplicationWindow
} = require("../controller/ApplicationWindowController");

const router = require("express").Router();

//Todo: Add isAdmin middleware to routes after testing and speaking with Uduak
router.put("/approve-stipend", approveStipend);
/**
 * @todo: Fix the reject-stipend logic.
 * @description: In it's current state, it doesn't make sense to have to add every stipend request to be rejected
 */
router.put("/reject-stipend", rejectStipend);
router.post("/notify-waitlist", notifyWaitlist);
router.post("/application-window", setApplicationWindow);
router.put("/close-application-window", manuallyCloseApplicationWindow);

module.exports = router;
