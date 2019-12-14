const mongoose = require("mongoose");

const { Schema } = mongoose;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  }
});

module.exports = mongoose.model("Events", eventSchema);
