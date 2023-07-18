const { requestStipend } = require("../../controller/StipendRequestController");

const router = require("express").Router();

router.post("/request-stipend", requestStipend);

module.exports = router;
