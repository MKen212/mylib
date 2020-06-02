// Set-up Environment Variables for credentials and default values
const Dotenv = require("dotenv");
const dotenvConfig = Dotenv.config();
if (dotenvConfig.error) console.log(dotenvConfig.error);

// Set-up Express Server
const express = require("express");
const app = express();
const port  = process.env.PORT || 3000;

// Set-up Express Layouts
const expressLayouts = require("express-ejs-layouts");

// Set-up Mongoose Connection for MongoDB
const mongoose = require("mongoose");
const dbURL = process.env.DBSERVER + process.env.DBNAME;

// Set-up Routes Index
const indexRouter = require("./routes/index");

// Configure Express to use ejs & ejs-layouts
app.set("view engine", "ejs");
app.set("views","./views");
app.set("layout", "layouts/layout");

// Use Express Layouts
app.use(expressLayouts);

// Use Express.static to serve static files from public directory
app.use(express.static("./public"));

// Set-up indexRouter to serve the routes
app.use("/", indexRouter);

// Connect to MongoDB
mongoose.connect(dbURL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log(`Connected to MongoDB using database ${db}...`));

// Start Express server
app.listen(port, function(){
  console.log(`Express HTTP Web Server is running on port ${port}...`);
});

