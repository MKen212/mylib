// Index of all the routes (controllers) for the app

// Initialise Express Router
const express = require("express");
const router = express.Router();


// Default Get Route - Display Index
router.get("/", function (req, res) {
  res.render("index");
});

// Export this file to the router variable
module.exports = router;