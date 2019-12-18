const Event = require("../../schema-models/event-model");
const User = require("../../schema-models/user-model");
const { formattedUser, formattedEvents } = require("../../utils/format");
const { dateToString } = require("../../utils/dates");

exports.events = () => {
  console.log("hey");
  return (
    Event.find()
      //.populate("createdBy")  --> Orginally .populate() so createdBy field would be populated with user data. Use 'formattedUser' func to populate this data instead. Means now I've got a full user object for createdBy, rather than just user ID.
      .then(results => {
        return results.map(result => {
          const fullEvent = {
            ...result._doc,
            date: dateToString(result._doc.date),
            createdBy: formattedUser(result.createdBy)
          };
          return fullEvent;
        });
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
  );
};

exports.createEvent = ({ eventInput }) => {
  const { title, description, price, date } = eventInput;
  const event = new Event({
    title: title,
    description: description,
    price: +price,
    date: dateToString(date),
    createdBy: "5df653999d294a2e06cfde03"
  });
  return event
    .save()
    .then(result => {
      return User.findById("5df653999d294a2e06cfde03");
    })
    .then(user => {
      if (!user) {
        throw new Error("User not found");
      }
      user.createdEvents.push(event);
      user.save();
      const fullEvent = {
        ...event._doc,
        createdBy: formattedUser(event.createdBy)
      };
      return fullEvent;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
