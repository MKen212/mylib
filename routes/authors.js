// Routes for Authors Functionality

// Initialise Express Router
const express = require("express");
const router = express.Router();

// Initialise Author & Book Models
const Author = require("../models/author");
const Book = require("../models/book");


// Show All Authors
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

// Show New Author Form
router.get("/new", function (req, res) {
  res.render("authors/new", {
    author: new Author()
  });
});

// Create New Author
router.post("/", async function (req, res) {
  let author = new Author({
    name: req.body.name
  });
  try {
    let newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch (err) {
    res.render("authors/new", {
      author: author,
      errorMessage: `Error creating Author: ${err}`
    });
  }
});

// Show Author
router.get("/:id", async function (req, res) {
  try {
    let author = await Author.findById(req.params.id);
    let booksByAuthor = await Book.find({ authorId: author.id }).limit(6).exec();
    res.render("authors/show", {
      author: author,
      booksByAuthor: booksByAuthor
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// Show Edit Author Form
router.get("/:id/edit", async function (req, res) {
  try {
    let author = await Author.findById(req.params.id);
    res.render("authors/edit", {
      author: author
    });
  } catch (err) {
    res.redirect("authors/");
  }
});

// Update Author
router.put("/:id", async function (req, res) {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (err) {
    if (author == null) {  // author not found
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: `Error updating Author: ${err}`
      });
    }
  }
});

// Delete Author
router.delete("/:id", async function (req, res) {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect("/authors");
  } catch (err) {
    if (author == null) {  // author not found
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

// Export this file to the router variable
module.exports = router;