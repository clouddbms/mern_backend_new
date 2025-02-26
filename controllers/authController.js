const User = require("../models/User");
const Expert = require("../models/Expert");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../secrets/secret");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

const bodyParser = require("body-parser");
const parseForm = bodyParser.urlencoded({ extended: false });

//Signup controller
const register_post = async (req, res) => {
  // console.log(req.body)
  let firstname = req.body.fname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let password = req.body.pswd;
  let phoneno = req.body.phno;
  let registeras = req.body.registeras;
  
  if (registeras === "user") {
    try {
      
      const hashedpswd = await bcrypt.hash(password, 12);
      const user = await User.create({
        firstname,
        lastname,
        email,
        password: hashedpswd,
        phone: phoneno,
      });
      // console.log(user);

      res.status(201).json({ user: user._id, data: user });
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
    }
  } else if (registeras === "expert") {
    const resume = req.body.resume;
    try {
      const hashedpswd = await bcrypt.hash(password, 12);
      const expert = await Expert.create({
        firstname,
        lastname,
        email,
        password: hashedpswd,
        phone: phoneno,
        resume: resume,
        is_blocked: true,
      });
      console.log(expert);
      res.status(201).json({ expert: expert._id });
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
    }
  }
};

//Controller for login



const login_post = async (req, res) => {
  console.log(req.body) 
  let email = req.body.email;
  let password = req.body.password;
  const user = await User.findOne({ email: email });
  const expert = await Expert.findOne({ email: email });
  const admin = await Admin.findOne({ email: email });
  if (user) {
    // check password using bcrypt
    let didMatch = await bcrypt.compare(password, user.password);
    if (didMatch) {
      // create jwt token (expires in 24 hours)
      const payload = {
        id: user._id,
        role: "user",
      };
      let token = jwt.sign(payload, secretKey, { expiresIn: 86400 });
      let BearerToken = "Bearer " + token;
      res.status(200).json({ token: BearerToken });
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  } else if (expert) {
    let didMatch = await bcrypt.compare(password, expert.password);
    if (didMatch) {
      // create jwt token (expires in 24 hours)
      const payload = {
        id: expert._id,
        role: "expert",
      };
      let token = jwt.sign(payload, secretKey, { expiresIn: 86400 });
      let BearerToken = "Bearer " + token;
      res.status(200).json({ token: BearerToken });
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  } else if (admin) {
    let didMatch = await bcrypt.compare(password, admin.password);
    if (didMatch) {
      const payload = {
        id: admin._id,
        role: "admin",
      };
      let token = jwt.sign(payload, secretKey, { expiresIn: 86400 });
      let BearerToken = "Bearer " + token;
      res.status(200).json({ token: BearerToken });
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  } else {
    res.status(400).json({ message: "Email not registered" });
  }
};

//Controller for logging in using Google
const googleSignIn_post = async (req, res) => {
  const {
    email,
    given_name: firstname,
    family_name: lastname,
    picture: profile_image_link,
  } = req.body;

  let user = await User.findOne({ email: email, is_outh_user: true });

  // check if user already exists
  if (user != null && user != undefined) {
    console.log("existing oauth user");
    // create jwt token (expires in 24 hours)
    const payload = {
      id: user._id,
      role: "user",
    };
    let token = jwt.sign(payload, secretKey, { expiresIn: 86400 });
    let BearerToken = "Bearer " + token;
    res.status(200).json({ token: BearerToken });
  } else {
    console.log("new oauth user");
    try {
      user = await User.create({
        email,
        firstname,
        lastname,
        profile_image_link,
        is_outh_user: true,
      });
      // create jwt token (expires in 24 hours)
      const payload = {
        id: user._id,
        role: "user",
      };

      let token = jwt.sign(payload, secretKey, { expiresIn: 86400 });
      let BearerToken = "Bearer " + token;
      res.status(200).json({ token: BearerToken });
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
    }
  }
};

//Email checking controller
const checkEmail_get = async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email: email });
  const expert = await Expert.findOne({ email: email });
  const admin = await Admin.findOne({ email: email });
  if (user || expert || admin) {
    res
      .status(200)
      .json({ message: "Email already registered", status: "true" });
  } else {
    res.status(200).json({ message: "Email not registered", status: "false" });
  }
};

//Deleting a expert account controller
const remove_Expert = async (req, res) => {
  try {
    const expertId = req.params.expertid;
    console.log(expertId)

    // Check if the expert with the given ID exists
    const existingExpert = await Expert.findById(expertId);

    if (!existingExpert) {
      return res.status(404).json({ error: "Expert not found", status: false });
    }

    // Delete the expert
    await Expert.findByIdAndDelete(expertId);

    res.json({ message: "Expert deleted successfully", status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", status: false });
  }
};

//Blocked State updation controller
const updateblockedstate = async (req, res) => {
  try {
    const expertId = req.params.expertid;

    // Find the expert by ID
    const existingExpert = await Expert.findById(expertId);
    console.log(existingExpert);

    if (!existingExpert) {
      return res.status(404).json({ error: "Expert not found", status: false });
    }

    // Update specific values for the expert
    existingExpert.is_blocked = !existingExpert.is_blocked;
    // Add other properties you want to update

    // Save the updated expert
    await existingExpert.save();
    // console.log(existingExpert);

    res.json({ status: true, expert: existingExpert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};

//Forgot password controller
const forgotpassword = async (req, res) => {
  email = req.body.email;
  person1 = await User.findOne({ email: email });
  person2 = await Expert.findOne({ email: email });
  if (person1 == null && person2 == null) {
    console.log("incorrect email not registered with us");
    data1 = "Incorrect mail match";
    res.json({ success: false, data: data1 });
  } else {
    let mailtransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "contactmindmeld2023@gmail.com",
        pass: "wgnfqhvyawxeziab",
      },
    });
    string = randomstring.generate(6);

    let details = {
      from: "contactmindmeld2023@gmail.com",
      to: email,
      subject: "OTP for changing password",
      text: "Your OTP is:" + string,
    };
    mailtransporter.sendMail(details, (err) => {
      if (err) console.log(err);
      else {
        sentdata = "Email has been sent successfully";
        console.log("email has sent");
        let type = "user";
        if (person2) {
          type = "expert";
        }

        res.json({ success: true, data: string, type });
      }
    });
  }
};

//Change password controller
const changepassword = async (req, res) => {
  email = req.body.email;
  pswd = req.body.newPassword;
  type = req.body.type;
  const hashedpswd = await bcrypt.hash(pswd, 12);
  if (type == "user")
    await User.updateOne({ email: email }, { $set: { password: hashedpswd } });
  if (type == "expert")
    await Expert.updateOne(
      { email: req.session.email },
      { $set: { password: hashedpswd } }
    );
  res.json({ success: true });
};

const getCSRFToken = (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
};

//Exporting all the controllers
module.exports = {
  register_post,
  login_post,
  checkEmail_get,
  remove_Expert,
  updateblockedstate,
  forgotpassword,
  changepassword,
  googleSignIn_post,
  getCSRFToken,
};
