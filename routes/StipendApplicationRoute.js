const {
  createStipendApplication,
  retrieveForOneClickApply,
  updateStipendApplication
} = require("../controller/StipendApplicationController");
const { isWindowOpen } = require("../middleware/ApplicationWIndowMiddleware");
const { isAuthenticated } = require("../middleware/isAuthenticatedMiddleware");
const router = require("express").Router();

router.post("/apply", isWindowOpen, isAuthenticated, createStipendApplication);
router.post("/update", isWindowOpen, isAuthenticated, updateStipendApplication);
router.post(
  "/apply/one-click",
  isWindowOpen,
  isAuthenticated,
  retrieveForOneClickApply
);

module.exports = router;
