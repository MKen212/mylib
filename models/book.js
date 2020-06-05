// Book Model

// Initialise Mongoose Connection for MongoDB
const mongoose = require("mongoose");

// Initialist Path Node Library for File Paths
const path = require("path");

// Book Image Upload Path
const bookImagePath = "uploads/bookImages";

// Create Book Schema (Table)
const bookSchema = new mongoose.Schema( {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  imageFilename: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});

bookSchema.virtual("imagePath").get(function () {
  if (this.imageFilename != null) {
    return path.join("/", bookImagePath, this.imageFilename);
  }
});

module.exports = mongoose.model("Book", bookSchema);
module.exports.bookImagePath = bookImagePath;
