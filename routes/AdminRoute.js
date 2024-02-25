const { isAdminUser } = require("../middleware/isAdminUserMiddleware");
const {
  batchApproveStipendApplications,
  updateStipendApplicationsToReviewStatus
} = require("../controller/StipendApplicationController");
const { notifyWaitlist } = require("../controller/WaitlistController");

const router = require("express").Router();

router.post("/notify-waitlist", isAdminUser, notifyWaitlist);
router.put(
  "/applications/batch/update-status",
  isAdminUser,
  updateStipendApplicationsToReviewStatus
);
router.put(
  "/applications/batch/approve",
  isAdminUser,
  batchApproveStipendApplications
);

/**
 * @todo: Fix all the endpoints below
 */
// router.put("/approve-stipend", approveStipend);
// router.put("/reject-stipend", rejectStipend);
// router.post("/application-window", setApplicationWindow);
// router.put("/close-application-window", manuallyCloseApplicationWindow);

module.exports = router;
