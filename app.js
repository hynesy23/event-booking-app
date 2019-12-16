const express = require("express");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql"); // buildSchema defines our schema object using a string
const mongoose = require("mongoose");
const Event = require("./models/event-model");
const User = require("./models/user-model");
const { getAllEvents } = require("./controllers/event-controller");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

// Below, this function will take an array of event IDs that comes from a user objects 'createdEvents' key. It will return a list of events by that user. Then, it will format the events so that the event.createdBy field is populated with a full user object. We get this object from the formattedUser function.

const formattedEvents = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return { ...event._doc, createdBy: formattedUser(event.createdBy) };
      });
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

app.use(
  "/graphql",
  graphqlHttp({
    // This takes a configuration object. Needs to know where to look for the schema and endpoints. Where are th resolvers where I forwrd my request? We pass two keys, schema and rootValue.
    schema: buildSchema(`   

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        createdBy: User!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [Event!]
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
        events: [Event!]!
        users: [User!]
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
      // Points to where all resolver functions live. rootValue also known as RESOLVER
      events: () => {
        return (
          Event.find()
            //.populate("createdBy")  --> Orginally .populate() so createdBy field would be populated with user data. Use 'formattedUser' func to populate this data instead. Means now I've got a full user object for createdBy, rather than just user ID.
            .then(results => {
              return results.map(result => {
                const fullEvent = {
                  ...result._doc,
                  createdBy: formattedUser(result.createdBy)
                };
                console.log(fullEvent, "full user");
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
            console.log(fullEvent, "full event log");
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
      }
    },
    graphiql: true // Development tool for graphQL. Special URL we can visit to play around with api
  })
);

mongoose
  .connect(
    `mongodb+srv://Cillian:${process.env.MONGO_PASSWORD}@event-booking-app-iewdp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("hello");
    });
  })
  .catch(console.log());

module.exports = app;
