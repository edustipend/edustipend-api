const {
  createFirstStipendApplication,
  isValidUser,
  stipendApplicationHistory,
  verifyLoggedInUser,
  verifyUser
} = require("../controller/UserController");
const { isWindowOpen } = require("../middleware/ApplicationWIndowMiddleware");
const { isAuthenticated } = require("../middleware/isAuthenticatedMiddleware");
const {
  verifyUserMiddleware,
  verifyLoggedInUserMiddleware
} = require("../middleware/verifyUserMiddleware");
const router = require("express").Router();

/**
 * @description add the middleware that will check whether window is open or not
 * @todo uncomment line 10 to use the middleware
 */
// router.use(isWindowOpen)

router.post(
  "/stipend/apply",
  isWindowOpen,
  createFirstStipendApplication
);
router.post("/check", isValidUser);
router.post(
  "/stipend/application-history",
  isAuthenticated,
  stipendApplicationHistory
);
router.post(
  "/verify",
  verifyUserMiddleware,
  verifyUser
);
router.post(
  "/logged-in/verify",
  verifyLoggedInUserMiddleware,
  verifyLoggedInUser
);

module.exports = router;
