const Faq = require("../models/Faq");
const User = require("../models/User");
const Expert = require("../models/Expert");
const nodemailer = require("nodemailer");

//FAQ controller

const faq_get = async (req, res) => {
  const faqs = await Faq.find({});
  res.status(200).json(faqs);
};

//FAQ filter controller
const faq_filters_post = async (req, res) => {
  const { is_solved, all_or_your, choose_topic, search_value, userId } =
    req.body;
  const searchFilters = {
    is_answered: is_solved ,
  };

  if (all_or_your == "your") {
    searchFilters.user_id = userId;
  } else if (all_or_your == "solved") {
    searchFilters.expert_id = userId;
  }
  //Based on Topic
  if (choose_topic != "") {
    searchFilters.topic = choose_topic;
  }

  const faqs = await Faq.find(searchFilters);
  //Based on tags
  if (search_value != "") {
    const searchResults = faqs.filter((faq) => {
      return faq.question.toLowerCase().includes(search_value.toLowerCase());
    });
    res.status(200).json(searchResults);
  } else res.status(200).json(faqs);
};


//FAQ post controller
const faq_post = async (req, res) => {
  const { user_id, topic, question } = req.body;
  console.log(req.body);
  const faq = new Faq({
    user_id,
    topic,
    question,
  });
  await faq.save();
  res.status(200).json({ message: "Question added successfully" });
};

//Answer post for FAQ controller
const faq_answer_post = async (req, res) => {
  console.log(req.body);
  const { faq_id, expert_id, answer } = req.body;
  const faq = await Faq.findById(faq_id);
  faq.expert_id = expert_id;
  faq.answer = answer;
  faq.is_answered = true;
  // faq['profile-image-link']=req.body['profile-image-link'];
  await faq.save();
  res.status(200).json({ message: "Answer added successfully" });
};

//Nodemailer controller
const email_members = async (req, res) => {
  let subject = req.body.subject;
  let text = req.body.message;
  let experts = req.body.experts;
  let users = req.body.users;
  console.log(req.body);
  let emails = [];
  let email1 = [];
  let email2 = [];
  if (experts == true) {
    email1 = await Expert.find({}, { email: 1, _id: 0 });
  }

  if (users == true) {
    email2 = await User.find({}, { email: 1, _id: 0 });
  }

  emails = [...email1, ...email2];
  const emailsArray = emails.map((obj) => obj.email);
  // console.log(emailsArray);
  let mailtransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "contactmindmeld2023@gmail.com",
      pass: "wgnfqhvyawxeziab",
    },
  });
  let details = {
    from: "contactmindmeld2023@gmail.com",
    to: emailsArray,
    subject: subject,
    text: text,
  };
  mailtransporter.sendMail(details, (err) => {
    if (err) res.json({ success: false });
    else {
      sentdata = "Email has been sent successfully";
      console.log("email has sent");
      res.json({ success: true });
    }
  });
};

//Exporting all the controllers
module.exports = {
  faq_get,
  faq_filters_post,
  faq_post,
  faq_answer_post,
  email_members,
};
