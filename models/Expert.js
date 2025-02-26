const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Expert Schema
const expertSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstname: {
      type: String,
      required: [true, "First name is required"],
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
    },
    domain: {
      type: String,
      default: "not specified",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    gender: {
      type: String,
      default: "not specified",
    },
    resume: {
      type: String,
      default: "resume",
      required: [true, "resume is required"],
    },
    insta_link: {
      type: String,
      default: "/",
    },
    facebook_link: {
      type: String,
      default: "/",
    },
    github_link: {
      type: String,
      default: "/",
    },
    qualification: {
      type: String,
      default: "not specified",
    },
    dateofbirth: {
      type: Date,
      default: Date.now,
    },
    profile_image_link: {
      type: String,
      default:
        "https://th.bing.com/th/id/OIP.z4no5tqp2ryBdMMD5NU9OgHaEv?w=245&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "expert",
    },
  },
  { timestamps: true }
);

const Expert = mongoose.model("expert_model", expertSchema);

module.exports = Expert;
