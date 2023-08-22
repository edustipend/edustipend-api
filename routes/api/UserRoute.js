const { requestStipend } = require("../../controller/StipendRequestController");
const {
  isWindowOpen
} = require("../../middleware/ApplicationWIndowMiddleware");

const router = require("express").Router();
/**
 * @description add the middleware that will check whether window is open or not
 * @todo uncomment line 10 to use the middleware
 */

// router.use(isWindowOpen)
router.post("/request-stipend", requestStipend);

module.exports = router;
