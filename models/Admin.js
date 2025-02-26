const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Admin Schema
const adminSchema = new Schema(
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
      default: "not specified",
    },
    gender: {
      type: String,
      default: "not specified",
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
    doj: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("admin_model", adminSchema);

module.exports = Admin;
