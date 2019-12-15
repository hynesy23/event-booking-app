const Event = require("../models/event-model");

const getAllEvents = () => {
  console.log("hiiii");
  return Event.find()
    .then(result => {
      console.log(result);
      return result;
    })
    .catch(console.log());
};

module.exports = { getAllEvents };
