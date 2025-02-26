const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Query Schema
const queryScema = new Schema({
  firstname: {
    type: String,
    required: [true, "first name is required"],
  },
  lastname: {
    type: String,
    required: [true, "last name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  phone: {
    type: String,
    required: [true, "phone number is required"],
  },
  message: {
    type: String,
    required: [true, "message is required"],
  },
  isresolved: {
    type: Boolean,
    default: false,
  },
});

const Query = mongoose.model("query_model", queryScema);

module.exports = Query;
