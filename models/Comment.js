const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Comment Schema
const commentSchema = new Schema({
  article_id: {
    type: String,
    required: [true, "article_id is required"],
  },
  user_id: {
    type: String,
    required: [true, "user_id is required"],
  },
  user_name: {
    type: String,
    required: [true, "username is required"],
  },
  profile_image_link: {
    type: String,
    default: "/images/doctor.jpg",
  },
  posted_date: {
    type: Date,
    default: new Date(),
  },
  comment_info: {
    type: String,
    required: [true, "comment info is required"],
  },
  popularity: {
    type: Number,
    default: 0,
  },
  is_main_comment: {
    type: Boolean,
    default: false,
  },
  reply_for: {
    type: String,
  },
  replies_ids: {
    type: Array,
    default: [],
  },
  main_comment_id: {
    type: String,
    default: "",
  },
});

const Comment = mongoose.model("comment_model", commentSchema);

module.exports = Comment;
