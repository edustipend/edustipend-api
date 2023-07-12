const userRouter = require("express").Router();
const { requestStipend } = require("../../controller/UserController");

userRouter.post("/request-stipend", requestStipend);

module.exports = userRouter;
