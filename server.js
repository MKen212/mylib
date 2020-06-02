// Set-up Express Server
const express = require("express");
const app = express();
const port  = process.env.PORT || 3000;

// Set-up Express Layouts
const expressLayouts = require("express-ejs-layouts");

// Set-up Routes Index
const indexRouter = require("./routes/index");

// Configure Express to use ejs & ejs-layouts
app.set("view engine", "ejs");
app.set("views","./views");
app.set("layout", "layouts/layout");

// Use Express Layouts
app.use(expressLayouts);

// Set-up directory used to serve static files
app.use(express.static("./public"));

// Set-up indexRouter to serve the routes
app.use("/", indexRouter);

// Start Expreess server
app.listen(port, function(){
  console.log(`Express HTTP Web Server is running on port ${port}...`);
});

