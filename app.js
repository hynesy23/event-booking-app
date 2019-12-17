const express = require("express");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const { getAllEvents } = require("./controllers/event-controller");
const graphQLSchema = require("./graphql/schema");
const graphQLResolvers = require("./graphql/resolvers");

const app = express();

app.use(express.json());

app.use(
  "/graphql",
  graphqlHttp({
    // This takes a configuration object. Needs to know where to look for the schema and endpoints. Where are th resolvers where I forwrd my request? We pass two keys, schema and rootValue.
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
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
