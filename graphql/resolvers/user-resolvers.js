const User = require("../../schema-models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.users = () => {
  return User.find()
    .populate("createdEvents")
    .then(result => {
      return result;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

exports.createUser = ({ userInput }) => {
  console.log("create user");
  const { email, password } = userInput;
  return User.findOne({ email })
    .then(user => {
      if (user) {
        console.log("oh no");
        throw new Error("User already exists"); // First, we are checking if user already exists. If not, we are then hashing their password.
      }
      return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword // Here, we are just creating a new user Object
      });
      return user.save();
    })
    .then(result => {
      return { ...result, password: null, email };
    })
    .catch(err => {
      throw err;
    });
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid login credentials");
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw new Error("Invalid login credentials");
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, "asecretkey", {
    expiresIn: "1h"
  });
  return { userId: user.id, token, tokenExpiration: 1 };
};
