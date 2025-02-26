const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Bookmark Schema
const bookmarkSchema = new Schema({
  user_id: {
    type: String,
    required: [true, "user_id is required"],
  },
  bookmarks_ids: {
    type: Array,
    default: [],
  },
});

const Bookmark = mongoose.model("bookmarks_model", bookmarkSchema);

module.exports = Bookmark;
