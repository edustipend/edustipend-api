const router = require("express").Router();
const { joinWaitlist, notifyWaitlist } = require("../../controller/WaitlistController");
// middleware for verifying that someone is an admin
const { isAdmin } = require("../../middleware/AuthMiddleware")

router.post("/join-waitlist", joinWaitlist);

// add isAdmin middleware
router.post("/notify-waitlist", notifyWaitlist)

/**
 * @todo we still need to discuss on whether we will empty the waitlist after every month, or keep it
 * @todo and if we will keep it, we will need to periodically change the "hasBeenNotified" to false after a window closes
 */

module.exports = router;
