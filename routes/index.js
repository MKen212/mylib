// Index of all the routes (controllers) for the app

// Set-up Express Router
const express = require("express");
const router = express.Router();


// Default Route
router.get("/", function (req, res) {
  res.render("main");

});

// Export this file to the router variable
module.exports = router;