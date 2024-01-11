const {
  createStipendApplication,
  retrieveForOneClickApply
} = require("../controller/StipendApplicationController");
const { isWindowOpen } = require("../middleware/ApplicationWIndowMiddleware");
const { isAuthenticated } = require("../middleware/isAuthenticatedMiddleware");
const router = require("express").Router();

/**
 * @description add the middleware that will check whether window is open or not
 * @todo uncomment line 10 to use the middleware
 */
// router.use(isWindowOpen)

router.post("/apply", isAuthenticated, createStipendApplication);
router.get("/one-click-apply/:email", retrieveForOneClickApply);

module.exports = router;
