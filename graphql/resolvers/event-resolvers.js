const Event = require("../../schema-models/event-model");
const User = require("../../schema-models/user-model");
const { formattedUser } = require("../../utils/format");
const { dateToString } = require("../../utils/dates");

exports.events = () => {
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

exports.createEvent = ({ eventInput }, req) => {
  console.log("event");
  if (!req.isAuth) {
    throw new Error("User not authenticated");
  }
  const { title, description, price, date } = eventInput;
  const event = new Event({
    title: title,
    description: description,
    price: +price,
    date: dateToString(date),
    createdBy: req.userId
  });
  return event
    .save()
    .then(result => {
      return User.findById(req.userId);
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
