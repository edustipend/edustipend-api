const {
	createFirstStipendApplication,
	isValidUser,
	stipendApplicationHistory,
	verifyUser
} = require("../controller/UserController");
const { isWindowOpen } = require("../middleware/ApplicationWIndowMiddleware");
const { isAuthenticated } = require("../middleware/isAuthenticatedMiddleware");
const { verifyEmailMiddleware } = require("../middleware/verifyEmailMiddleware");
const router = require("express").Router();

/**
 * @description add the middleware that will check whether window is open or not
 * @todo uncomment line 10 to use the middleware
 */
// router.use(isWindowOpen)

router.post("/stipend/apply", /** isWindowOpen,  **/ createFirstStipendApplication);
router.get("/check", isValidUser);
router.get("/stipend/application-history", isAuthenticated, stipendApplicationHistory);
// router.get("/stipend/application-history", stipendApplicationHistory);
router.post("/verify", verifyEmailMiddleware, verifyUser);


module.exports = router;
