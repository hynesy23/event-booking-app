const usersRouter = require("express").Router();

usersRouter.route("/").get(() => {
  console.log("hello there");
});

module.exports = usersRouter;
