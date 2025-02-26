const Query = require("../models/Query");

//Contact us controller
const contact_us = (req, res) => {
  const query = new Query({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    message: req.body.message,
    phone: req.body.phone,
  });
  console.log(query);
  query
    .save()
    .then(() => {
      // console.log('Document saved')
      res.json({ success: true });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
};

//All Queries retreival controller
const all_queries = async (req, res) => {
  query_data = await Query.find({ isresolved: false });
  res.json({ data: query_data });
};

//Post query controller
const postquery = (req, res) => {
  id = req.params.id;
  //  console.log(id);
  Query.updateOne({ _id: id }, { $set: { isresolved: true } })
    .then((updated) => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.json({ success: false });
    });
};

//Exporting all the controllers
module.exports = { contact_us, all_queries, postquery };
