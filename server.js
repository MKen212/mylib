// Set-up Environment Variables for credentials and default values
const Dotenv = require("dotenv");
const dotenvConfig = Dotenv.config();
if (dotenvConfig.error) console.log(dotenvConfig.error);

// Set-up Express Server
const express = require("express");
const app = express();
const port  = process.env.MYLIB_EXPPORT || 3000;

// Set-up Express Layouts & Body Parser
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

// Set-up Routers for each route
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");

// Configure Express to use ejs & ejs-layouts
app.set("view engine", "ejs");
app.set("views","./views");
app.set("layout", "layouts/layout");

// Use Express Layouts & Body Parser
app.use(expressLayouts);
app.use(bodyParser.urlencoded( {limit: "10mb", extended: false }));

// Use Express.static to serve static files from public directory
app.use(express.static("./public"));

// Use the Routers to serve the routes
app.use("/", indexRouter);
app.use("/authors", authorRouter);


// Set-up Mongoose Connection for MongoDB
const mongoose = require("mongoose");
const dbServer = process.env.MYLIB_DBURL;
const dbName = process.env.MYLIB_DBNAME;

// Connect to MongoDB
mongoose.connect((dbServer + dbName), {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log(`Connected to MongoDB at ${dbServer}${dbName}...`));


// Start Express server
app.listen(port, function(){
  console.log(`Express HTTP Web Server is running on port ${port}...`);
});

