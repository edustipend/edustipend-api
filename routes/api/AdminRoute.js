const { approveStipend, rejectStipend } = require("../../controller/StipendRequestController");

const router = require("express").Router();

//Todo: Add isAdmin middleware to routes after testing and speaking with Uduak
router.put("/approve-stipend", approveStipend)
router.put("/reject-stipend", rejectStipend)

module.exports = router;