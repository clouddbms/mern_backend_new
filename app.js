const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routes/authRoutes");
const articlesRoutes = require("./routes/articlesRoutes");
const userRoutes = require("./routes/userRoutes");
const queriesRoutes = require("./routes/queriesRoutes");
const utilityRoutes = require("./routes/utilityRoutes");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

const csrf = require("csurf");
const loginroutes = require("./routes/login_routes");
const helmet = require("helmet");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

dotenv.config();
const connectionParams = {
  useNewUrlParser: true,
};
const mongoUri = process.env.myUri;
// remove once testing is done
mongoose.connect(mongoUri, connectionParams).then(() => {
    console.log("Connected to database ");
})
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });


const options={
  definition:{
    openapi: "3.0.0",
    info:{
      title: "MINDMELD API",
      version: "1.0.0",
      description: "A blogging and question and answering platform"
  },
  servers: [
    {
      url: "https://mern-backend-new-i3ta.onrender.com",
    },
  ],
  components:{
    securitySchemes:{
      bearerAuth:{
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        value:"Bearer <JWT token here>"
  }
}
  },
},
  apis: ["./routes/*.js"],


}




module.exports = options;
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
//third party middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

function getLogFileName() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
  const day = now.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  return path.join(__dirname, "logs", `access_${year}-${month}-${day}.log`);
}
app.use(
  cors({
    origin: ["http://localhost:3000","https://mern-frontend-new-iota.vercel.app","https://mind-meld-react.vercel.app"],
    methods: ["POST", "GET", "HEAD", "PUT", "DELETE"],
    credentials: true,
  })
);


// create a test get route to check if the server is running
app.get("/", (req, res) => {
  res.send("Server is Now running Successfully!!!");
});

// Set up the morgan logger middleware to log to the dynamically generated log file
app.use(
  morgan("tiny", {
    stream: fs.createWriteStream(getLogFileName(), { flags: "a" }),
  })
);
app.use(cookieParser());

//inbuilt middlware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/auth", authRoutes);
app.use("/articles", articlesRoutes);
app.use("/user", userRoutes);
app.use("/queries", queriesRoutes);
app.use("/utility", utilityRoutes);
app.use("/log", loginroutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.log("error occured")
  // Log the error for debugging purposes
  console.error(err.stack);

  // Set the HTTP status code and send an error response
  res.status(500).send("Internal Server Error");
});


module.exports = app;
