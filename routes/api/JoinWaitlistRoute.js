const router = require("express").Router();
const {
  joinWaitlist,
  notifyWaitlist
} = require("../../controller/WaitlistController");

router.post("/join-waitlist", joinWaitlist);

/**
 * @todo we still need to discuss on whether we will empty the waitlist after every month, or keep it
 * @todo and if we will keep it, we will need to periodically change the "hasBeenNotified" to false after a window closes
 */

module.exports = router;
