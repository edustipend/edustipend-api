const {
  approveStipend,
  rejectStipend
} = require("../../controller/StipendRequestController");
const { notifyWaitlist } = require("../../controller/WaitlistController");

const router = require("express").Router();

//Todo: Add isAdmin middleware to routes after testing and speaking with Uduak
router.put("/approve-stipend", approveStipend);
router.put("/reject-stipend", rejectStipend);
router.post("/notify-waitlist", notifyWaitlist);

module.exports = router;
