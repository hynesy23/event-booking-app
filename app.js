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
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
        events: [Event!]!
        users: [User!]!
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
        // console.log(events, "events");
        // return events;
        return Event.find()
          .then(result => {
            console.log(result);
            return result;
          })
          .catch(console.log());
      },
      users: () => {
        return User.find()
          .then(result => {
            console.log(result);
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
          date: new Date(date)
        });
        return event
          .save()
          .then(result => {
            return result;
          })
          .catch(console.log);
      },
      createUser: ({ userInput }) => {
        const { email, password } = userInput;
        return bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const user = new User({
              email: email,
              password: hashedPassword
            });
            return user.save();
          })
          .then(result => {
            console.log(result);
            return { ...result, email, password: null };
            //return result;
          })
          .catch(console.log);
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
