const Booking = require("../../schema-models/booking-model");
const Event = require("../../schema-models/event-model");
const { formattedUser, transformBooking } = require("../../utils/format");

exports.bookings = (args, req) => {
  if (!req.isAuth) {
    throw new Error("User not authenticated");
  }
  return Booking.find()
    .then(bookings => {
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

exports.bookEvent = async ({ eventId }, req) => {
  if (!req.isAuth) {
    throw new Error("User not authenticated");
  }
  let foundEvent;
  return Event.findById(eventId) // Here we need to find the event first before we can add it to Bookings
    .then(event => {
      foundEvent = event;
      const booking = new Booking({
        event: event,
        user: req.userId
      });
      return booking.save();
    })
    .then(booking => {
      return transformBooking(booking);
    })
    .catch(err => {
      console.log(err, "error");
      throw err;
    });
};

exports.cancelBooking = async ({ bookingId }, req) => {
  if (!req.isAuth) {
    throw new Error("User not authenticated");
  }
  try {
    const booking = await Booking.findById(bookingId).populate("event"); //Finding the right booking and filling up its 'event' field
    const event = {
      ...booking.event._doc,
      createdBy: formattedUser(booking.user), // Creating a new event object here so 'createdBy' is populated.
      deleted: true
    };
    await Booking.deleteOne({ _id: bookingId }); // Deleting booking befroe we return the event it is for
    return event;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
