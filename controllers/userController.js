const Bookmark = require("../models/Bookmark");
const Article = require("../models/Article");
const Expert = require("../models/Expert");
const User = require("../models/User");
const Admin = require("../models/Admin");

//Bookmarks retreival controller
const bookmarks_byUserId_get = async (req, res) => {
  const userId = req.params.userId;
  const bookmarks = await Bookmark.findOne({ user_id: userId });
  if (!bookmarks) {
    res.status(200).json([]);
    return;
  }
  const bookmarksIds = bookmarks.bookmarks_ids;
  const bookmarkedArticles = await Article.find({ _id: { $in: bookmarksIds } });
  res.status(200).json(bookmarkedArticles);
};

//Bookmarks adding controller
const bookmark_add_byUserId_post = async (req, res) => {
  const userId = req.params.userId;
  const articleId = req.params.articleId;

  const bookmarks = await Bookmark.findOne({ user_id: userId });
  if (!bookmarks) {
    const newBookmarks = new Bookmark({
      user_id: userId,
      bookmarks_ids: [articleId],
    });
    await newBookmarks.save();
    res.status(200).json({ message: "Bookmark added successfully" });
    return;
  }
  const bookmarksIds = bookmarks.bookmarks_ids;
  if (!bookmarksIds.includes(articleId)) {
    bookmarks.bookmarks_ids.push(articleId);
    bookmarks.save();
  }
  res.status(200).json({ message: "Bookmark added successfully" });
};

//Deleting Bookmarks controller
const bookmark_remove_byUserId_delete = async (req, res) => {
  const userId = req.params.userId;
  const articleId = req.params.articleId;

  const bookmarks = await Bookmark.findOne({ user_id: userId });
  bookmarks.bookmarks_ids = bookmarks.bookmarks_ids.filter(
    (bookmarkId) => bookmarkId != articleId
  );
  bookmarks.save();
  res.status(200).json({ message: "Bookmark removed successfully" });
};

const users_get = async (req, res) => {
  const users = await User.find({});
  const experts = await Expert.find({});
  res.status(200).json({ ...users, experts });
};

//User by ID getter controller
const user_get_byId = async (req, res) => {
  const userId = req.params.userId;

  const [user, expert, admin] = await Promise.all([
    User.findById(userId),
    Expert.findById(userId),
    Admin.findById(userId),
  ]);

  if (user) {
    delete user.password;
    res.status(200).json(user);
  } else if (expert) {
    delete expert.password;

    const articles = await Article.find({ author_id: userId });

    let totalLikes = 0;
    let totalDislikes = 0;

    // Iterate over each article to calculate total likes and dislikes
    articles.forEach((article) => {
      totalLikes += article.likes;
      totalDislikes += article.dislikes;
    });
    newexpert = expert.toObject();
    newexpert.totalLikes = totalLikes;
    newexpert.totalDislikes = totalDislikes;
    console.log(newexpert);
    res.status(200).json(newexpert);
  } else if (admin) {
    delete admin.password;
    res.status(200).json(admin);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

//User by email getter controller
const user_get_byEmail = async (req, res) => {

  const email = req.params.email;
  console.log(email)
  const user = await User.findOne({ email: email });
  const expert = await Expert.findOne({ email: email });
  const admin = await Admin.findOne({ email: email });

  if (user) {
    // remove password key itself from user object
    delete user.password;
    res.status(200).json(user);
  } else if (expert) {
    delete expert.password;
    res.status(200).json(expert);
  } else if (admin) {
    delete admin.password;
    res.status(200).json(admin);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

//User by Role getter controller
const users_get_byRole = async (req, res) => {
  const role = req.params.role;
  if (role === "user") {
    const users = await User.find({});
    res.status(200).json(users);
  } else if (role === "expert") {
    const experts = await Expert.find({});
    res.status(200).json(experts);
  } else if (role === "admin") {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } else {
    res.status(400).json({ message: "Invalid role" });
  }
};

//Articles by user id controller
const articles_getbyuserid = async (req, res) => {
  const userId = req.params.userId;
  const yourarticles = await Article.find({ author_id: userId });
  res.status(200).json(yourarticles);
};

//Update profile by ID controller
const user_update_byId_put = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  const expert = await Expert.findById(userId);
  const admin = await Admin.findById(userId);

  if (user) {
    const { firstname, lastname, gender, email, mobile, image_link } = req.body;
    const profile_image_link = image_link;
    console.log(req.body);
    user.firstname = firstname;
    user.lastname = lastname;
    user.profile_image_link = profile_image_link;
    user.email = email;
    user.phone = mobile;
    user.gender = gender;
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } else if (expert) {
    console.log(req.body);
    const {
      firstname,
      lastname,
      domain,
      gender,
      email,
      mobile,
      image_link,
      insta_link,
      facebook_link,
      github_link,
      qualification,
      dateofbirth,
    } = req.body;
    const profile_image_link = image_link;
    expert.firstname = firstname;
    expert.lastname = lastname;
    expert.domain = domain;
    expert.gender = gender;
    expert.email = email;
    expert.phone = mobile;
    expert.profile_image_link = profile_image_link;
    expert.insta_link = insta_link;
    expert.facebook_link = facebook_link;
    expert.github_link = github_link;
    expert.qualification = qualification;
    expert.dateofbirth = dateofbirth;

    await expert.save();
    res.status(200).json({ message: "Expert updated successfully" });
  } else if (admin) {
    console.log(req.body);
    const {
      firstname,
      lastname,
      domain,
      gender,
      email,
      mobile,
      image_link,
      insta_link,
      facebook_link,
      github_link,
      qualification,
      dateofbirth,
    } = req.body;
    const profile_image_link = image_link;
    admin.firstname = firstname;
    admin.lastname = lastname;
    admin.domain = domain;
    admin.gender = gender;
    admin.email = email;
    admin.phone = mobile;
    admin.profile_image_link = profile_image_link;
    admin.insta_link = insta_link;
    admin.facebook_link = facebook_link;
    admin.github_link = github_link;
    admin.qualification = qualification;
    admin.dateofbirth = dateofbirth;
    await admin.save();
    res.status(200).json({ message: "Admin updated successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

//Exporting all the controllers
module.exports = {
  bookmarks_byUserId_get,
  bookmark_add_byUserId_post,
  bookmark_remove_byUserId_delete,
  users_get,
  user_get_byId,
  user_get_byEmail,
  users_get_byRole,
  articles_getbyuserid,
  user_update_byId_put,
};
