const Event = require("../schema-models/event-model");
const User = require("../schema-models/user-model");
const { dateToString } = require("../utils/dates");

const transformBooking = booking => {
  return {
    ...booking,
    _id: booking.id,
    user: formattedUser(booking.user),
    event: formatSingleEvent(booking.event),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt)
  };
};

// Below, this function will take an array of event IDs that comes from a user objects 'createdEvents' key. It will return a list of events by that user. Then, it will format the events so that the event.createdBy field is populated with a full user object. We get this object from the formattedUser function.

const formattedEvents = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(), //Need to do this as date is saved to Mongo as a date object. When parsed back to string it is unreadable.
          createdBy: formattedUser(event.createdBy)
        };
      });
    })
    .catch(err => {
      throw err;
    });
};

// Below I am simply formatting one single event. This is for the booking objects
const formatSingleEvent = eventId => {
  return Event.findById(eventId)
    .then(event => {
      return {
        ...event._doc,
        createdBy: formattedUser(event.createdBy)
      };
    })
    .catch(err => {
      throw err;
    });
};

// The function below will take a userId and then return a full user object. This means that, when searching for an event below, rather than just having the userId in the 'createdBy' field, we will have a full user object. For the user object, we want to configure their createdEvent, so we call the formattedEvents function on them. This means we can deep dive into these objects.

const formattedUser = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        createdEvents: formattedEvents(user.createdEvents)
      };
    })
    .catch(err => {
      throw err;
    });
};

module.exports = {
  formatSingleEvent,
  formattedEvents,
  formattedUser,
  transformBooking
};
