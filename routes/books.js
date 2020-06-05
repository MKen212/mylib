// Routes for Books Functionality

// Initialise Express Router
const express = require("express");
const router = express.Router();

// Initialise Book & Author Models
const Book = require("../models/book");
const Author = require("../models/author");

// Set-up Multer using the Node.js path & fs libraries
const multer = require("multer");
const path = require("path");
const uploadPath = path.join("public", Book.bookImagePath);
const fs = require("fs");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  }
});


// Default Get Route - Shows All Books
router.get("/", async function (req, res) {
  let query = Book.find();
  if (req.query.title != null && req.query.title !== "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter !== "") {
    query = query.gte("publishedDate", req.query.publishedAfter);
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore !== "") {
    query = query.lte("publishedDate", req.query.publishedBefore);
  }
  try {
    let books = await query.exec();
    res.render("books/index", {
      books: books,
      searchOptions: req.query
    });
  } catch (err) {
    res.redirect("/");
  }
});

// Get New Book Route - Show New Book Form
router.get("/new", async function (req, res) {
  renderNewPage(res, new Book(), false);
});

router.get("/new", function (req, res) {
  res.render("authors/new", {
    author: new Author()
  });
});

// Post New Book Route - Create New Book
router.post("/", upload.single("image"), async function (req, res) {
  let filename = req.file != null ? req.file.filename : null;
  let book = new Book({
    title: req.body.title,
    authorId: req.body.authorId,
    publishedDate: new Date(req.body.publishedDate),
    pageCount: req.body.pageCount,
    imageFilename: filename,
    description: req.body.description
  });
  try {
    let newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect("books/");
  } catch (err) {
    if (book.imageFilename != null) removeImage(book.imageFilename);
    renderNewPage(res, book, err);
  }
});

// Function to show new Books Page
async function renderNewPage(res, book, hasError) {
  try {
    let authors = await Author.find({});
    let params = {
      authors: authors,
      book: book
    };
    if (hasError) params.errorMessage = `Error creating Author: ${hasError}`;
    res.render("books/new", params);
  } catch (err) {
    res.redirect("/books");
  }
}

// Function to remove an Image file if Add Record Failed
function removeImage(filename) {
  fs.unlink(path.join(uploadPath, filename), err => {
    if (err) console.error(err);
  });
}

// Export this file to the router variable
module.exports = router;