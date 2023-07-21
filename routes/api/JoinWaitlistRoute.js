const router = require("express").Router();
const { joinWaitlist } = require("../../controller/WaitlistController")

router.post('/join-waitlist', joinWaitlist)

module.exports = router