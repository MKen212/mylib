// Routes for Authors Functionality

// Initialise Express Router
const express = require("express");
const router = express.Router();

// Initialise Author Model
const Author = require("../models/author");


// Default Get Route - Shows All Authors
router.get("/", async function (req, res) {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    let authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query
    });
  } catch (err) {
    res.redirect("/");
  }
});

// Get New Author Route - Show New Author Form
router.get("/new", function (req, res) {
  res.render("authors/new", {
    author: new Author()
  });
});

// Post New Author Route - Create New Author
router.post("/", async function (req, res) {
  let author = new Author({
    name: req.body.name
  });
  try {
    let newAuthor = await author.save();
    // res.redirect(`authors/${newAuthor.id}`);
    res.redirect("authors/");
  } catch (err) {
    res.render("authors/new", {
      author: author,
      errorMessage: `Error creating Author: ${err}`
    });
  }
});

// Export this file to the router variable
module.exports = router;