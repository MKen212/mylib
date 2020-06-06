// Routes for Books Functionality

// Initialise Express Router
const express = require("express");
const router = express.Router();

// Initialise Book & Author Models
const Book = require("../models/book");
const Author = require("../models/author");

// Set ImageTypes accepted
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

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
router.post("/", async function (req, res) {
  let book = new Book({
    title: req.body.title,
    authorId: req.body.authorId,
    publishedDate: new Date(req.body.publishedDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  });
  saveImage(book, req.body.image);
  try {
    let newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect("books/");
  } catch (err) {
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

// Function to add the Image to the book record
function saveImage(book, imageEncoded) {
  if (imageEncoded == null) return;
  let image = JSON.parse(imageEncoded);
  if (image != null && imageMimeTypes.includes(image.type)) {
    book.imageData = new Buffer.from(image.data, "base64");
    book.imageType = image.type;
  }
}

// Export this file to the router variable
module.exports = router;