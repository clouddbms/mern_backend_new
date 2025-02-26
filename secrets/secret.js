const dotenv = require("dotenv");
dotenv.config();

const myUri = process.env.myUri;
const secretKey = process.env.secret_key;

module.exports = { myUri, secretKey };
