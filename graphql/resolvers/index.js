const Event = require("../../schema-models/event-model");
const User = require("../../schema-models/user-model");
const Booking = require("../../schema-models/booking-model");
const bcrypt = require("bcrypt");

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
  //return {};
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
  // Points to where all resolver functions live. rootValue also known as RESOLVER
  events: () => {
    return (
      Event.find()
        //.populate("createdBy")  --> Orginally .populate() so createdBy field would be populated with user data. Use 'formattedUser' func to populate this data instead. Means now I've got a full user object for createdBy, rather than just user ID.
        .then(results => {
          return results.map(result => {
            const fullEvent = {
              ...result._doc,
              date: new Date(result._doc.date).toISOString(),
              createdBy: formattedUser(result.createdBy)
            };
            return fullEvent;
          });
        })
        .catch(console.log())
    );
  },
  users: () => {
    return User.find()
      .populate("createdEvents")
      .then(result => {
        return result;
      })
      .catch(console.log);
  },
  bookings: () => {
    return Booking.find().then(bookings => {
      return bookings.map(booking => {
        return {
          ...booking._doc,
          createdAt: new Date(booking._doc.createdAt.toISOString()),
          updatedAt: new Date(booking._doc.updatedAt.toISOString())
        };
      });
    });
  },
  // events: getAllEvents,
  createEvent: ({ eventInput }) => {
    const { title, description, price, date } = eventInput;
    const event = new Event({
      title: title,
      description: description,
      price: +price,
      date: new Date(date),
      createdBy: "5df653999d294a2e06cfde03"
    });
    console.log(event, "event log");
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
      .catch(console.log);
  },
  createUser: ({ userInput }) => {
    const { email, password } = userInput;
    return User.findOne({ email })
      .then(user => {
        if (user) {
          console.log("oh no");
          throw new Error("User already exists");
        }
        return bcrypt.hash(password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result => {
        return { ...result, password: null, email };
      })
      .catch(err => {
        throw err;
      });
  },
  bookEvent: ({ eventId }) => {
    return Event.findById(eventId)
      .then(event => {
        console.log(event, "event?");
        const booking = new Booking({
          event: event,
          user: "5df653999d294a2e06cfde03"
        });
        return booking.save();
      })
      .then(booking => {
        console.log(booking, "book again");
        return {
          ...booking,
          _id: booking.id,
          createdAt: new Date(booking.createdAt.toISOString()),
          updatedAt: new Date(booking.updatedAt.toISOString())
        };
      })
      .catch(err => {
        throw err;
      });
  }
};
