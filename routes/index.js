// Index of all the routes (controllers) for the app

// Initialise Express Router
const express = require("express");
const router = express.Router();

// Initialise Book Model
const Book = require("../models/book");

// Default Get Route - Display Index
router.get("/", async function (req, res) {
  let books;
  try {
    books = await Book.find().sort({ createdDate: "desc"}).limit(10).exec();
  } catch (err) {
    books = [];
  }
  res.render("index", { books: books });
});

// Export this file to the router variable
module.exports = router;