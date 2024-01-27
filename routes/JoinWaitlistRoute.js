const router = require("express").Router();
const {
  joinWaitlist,
  notifyWaitlist
} = require("../controller/WaitlistController");
const { isAdminUser } = require("../middleware/isAdminUserMiddleware");

router.post("/join", joinWaitlist);
router.post("/notify", isAdminUser, notifyWaitlist);

/**
 * @todo we still need to discuss on whether we will empty the waitlist after every month, or keep it
 * @todo and if we will keep it, we will need to periodically change the "hasBeenNotified" to false after a window closes
 */

module.exports = router;
