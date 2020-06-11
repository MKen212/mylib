// Routes for Books Functionality

// Initialise Express Router
const express = require("express");
const router = express.Router();

// Initialise Book & Author Models
const Book = require("../models/book");
const Author = require("../models/author");

// Set ImageTypes accepted
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

// Show All Books
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

// Show New Book Form
router.get("/new", async function (req, res) {
  renderFormPage(res, new Book(), "new", false);
});

// Create New Book
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
    res.redirect(`books/${newBook.id}`);
  } catch (err) {
    renderFormPage(res, book, "new", err);
  }
});

// Show Book
router.get("/:id", async function (req, res) {
  try {
    let book = await Book.findById(req.params.id).populate("authorId").exec();
    res.render("books/show", {
      book: book,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// Show Edit Book Form
router.get("/:id/edit", async function (req, res) {
  try {
    let book = await Book.findById(req.params.id);
    renderFormPage(res, book, "edit", false);
  } catch (err) {
    res.redirect("books/");
  }
});

// Update Book
router.put("/:id", async function (req, res) {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.authorId= req.body.authorId;
    book.publishedDate = new Date(req.body.publishedDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    saveImage(book, req.body.image);
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch (err) {
    if (book != null) {
      renderFormPage(res, book, "edit", err);
    } else {
      res.redirect("/");
    }
  }
});

// Delete Book
router.delete("/:id", async function (req, res) {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.remove();
    res.redirect("/books");
  } catch (err) {
    if (book == null) {  // book not found
      res.redirect("/");
    } else {
      res.redirect(`/books/${book.id}`);
    }
  }
});

// Function to show Books Form Page
async function renderFormPage(res, book, form, hasError) {
  try {
    let authors = await Author.find({});
    let params = {
      authors: authors,
      book: book
    };
    if (hasError) {
      if (form == "edit") {
        params.errorMessage = `Error Updating Book: ${hasError}`;
      } else {
        params.errorMessage = `Error Creating Book: ${hasError}`;
      }
    }
    res.render(`books/${form}`, params);
  } catch (err) {
    res.redirect("/books");
  }
}

// Function to add the Image to the book record
function saveImage(book, imageEncoded) {
  if (imageEncoded == null || imageEncoded == "") return;
  let image = JSON.parse(imageEncoded);
  if (image != null && imageMimeTypes.includes(image.type)) {
    book.imageData = new Buffer.from(image.data, "base64");
    book.imageType = image.type;
  }
}

// Export this file to the router variable
module.exports = router;