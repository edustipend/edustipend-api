const {
  requestStipend,
  applicationStatus
} = require("../../controller/StipendRequestController");

const router = require("express").Router();

router.post("/request-stipend", requestStipend);
router.get("/application-status/:id", applicationStatus);

module.exports = router;
