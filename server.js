const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const port = process.env.PORT || 8000;
const mongoUri = process.env.myUri;

const connectionParams = {
  useNewUrlParser: true,
};

mongoose.connect(mongoUri, connectionParams).then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log("Connected to MongoDB Atlas & app listening on port " + port);
  });
})
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });
