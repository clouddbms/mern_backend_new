const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//FAQ schema
const faqSchema = new Schema({
  user_id: {
    type: String,
    required: [true, "user_id is required"],
  },
  topic: {
    type: String,
    required: [true, "Topic is required"],
  },
  popularity: {
    type: Number,
    default: 0,
  },
  question: {
    type: String,
    required: [true, "Question is required"],
  },
  answer: {
    type: String,
    default: " ",
  },
  "profile-image-link": {
    type: String,
    default: "/images/doctor.jpg",
  },
  is_answered: {
    type: Boolean,
    default: false,
  },
  expert_id: {
    type: String,
    default: "exp_id",
  },
});

const Faq = mongoose.model("faq", faqSchema);

module.exports = Faq;
