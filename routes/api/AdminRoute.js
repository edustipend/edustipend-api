const {
  approveStipend,
  rejectStipend
} = require("../../controller/StipendRequestController");
const {
  setApplicationWindow,
  manuallyCloseApplicationWindow
} = require("../../controller/ApplicationWindowController");

const router = require("express").Router();

//Todo: Add isAdmin middleware to routes after testing and speaking with Uduak
router.put("/approve-stipend", approveStipend);
router.put("/reject-stipend", rejectStipend);
router.post("/application-window", setApplicationWindow);
router.put("/close-application-window", manuallyCloseApplicationWindow);

module.exports = router;
