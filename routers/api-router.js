const apiRouter = require("express").Router();
const usersRouter = require("./users-router");

apiRouter.use("/", usersRouter);

module.exports = apiRouter;
